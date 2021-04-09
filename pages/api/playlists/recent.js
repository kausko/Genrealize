import { getSession } from "next-auth/client";
import Playlist from "../../../models/Playlist";

/**
 * @param  {import('next').NextApiRequest} req
 * @param  {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
	try {
		const session = await getSession({ req });
		const email = session.user.email;
		const results = await Playlist.aggregate([
			{
				'$match': {
					'email': email
				}
			}, {
				'$addFields': {
					'date': {
						'$dateToParts': {
							'date': '$lastPlayedAt'
						}
					}
				}
			}, {
				'$group': {
					'_id': {
						'year': '$date.year',
						'month': '$date.month',
						'day': '$date.day'
					},
					'playlist': {
						'$push': '$$ROOT'
					}
				}
			}, {
				'$sort': {
					'_id.year': -1,
					'_id.month': -1,
					'_id.day': -1
				}
			}, {
				'$limit': 1
			}
		])
		res.status(200).send(results)
	}
	catch (e) {
		res.status(500).send(e.message)
	}
}