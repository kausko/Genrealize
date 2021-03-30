import dbConnect from '../../../utils/dbConnect';
import Playlist from '../../../models/Playlist';
import { getSession } from 'next-auth/client';
import nestedUpsert from '../../../utils/nestedUpsert';
/**
 * @param  {import('next').NextApiRequest} req
 * @param  {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const { body, method } = req;
    await dbConnect();
    let pl;
    if (method === "GET") {
      pl = await Playlist.find({ email });
    }
    else if (method === "POST") {
      let name = body.name.toLowerCase() || "";
      if(name === '' || name.includes('favorite') || name.includes('favourite')) {
        name = 'Favourites';
      }
      const upsertedSongs = await nestedUpsert(body.songs)
      pl = await Playlist.updateOne(
        { name, email },
        { $push: { songs: { $each: upsertedSongs } } },
        { upsert: true }
      );
    }
    else {
      res.status(405).send("INVALID METHOD: " + method)
    }
    res.status(200).send(pl)
  } 
  catch (error) {
    console.error(error)
    if (error instanceof TypeError) {
      res.status(400).send(error.message)
    }
    res.status(500).send(error.message)
  }
}