import dbConnect from '../../../utils/dbConnect';
import Playlist from '../../../models/Playlist';
import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;
  await dbConnect();
  switch (method) {
    case 'GET':
      try {
        const pl = await Playlist.find({email: session.user.email});
        res.status(200).json({ success: true, data: pl });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { name }  = req.body;
        if(name === '')
          req.body.name = 'Favourites';
        const pl = await pl.create(req.body);
        res.status(201).json({ success: true, data: pl });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}