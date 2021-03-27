import dbConnect from '../../../utils/dbConnect';
import Playlist from '../../../models/Playlist';
export default async function handler(req, res) {
    const {
      query: { id },
      method,
    } = req
    const session = await getSession({ req });
    await dbConnect()
    switch (method) {
      case 'GET' /* Get a model by its ID */:
        try {
          const pl = await Playlist.findById(id)
          if (!pl) {
            return res.status(400).json({ success: false })
          }
          res.status(200).json({ success: true, data: pl })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
  
      case 'PUT' /* Edit a model by its ID */:
        try {
          const pl = await Playlist.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          })
          if (!pl) {
            return res.status(400).json({ success: false })
          }
          res.status(200).json({ success: true, data: pl })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
  
      case 'DELETE' /* Delete a model by its ID */:
        try {
          const deletedPl = await Playlist.deleteOne({ _id: id })
          if (!deletedPl) {
            return res.status(400).json({ success: false })
          }
          res.status(200).json({ success: true, data: {} })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
      default:
        res.status(400).json({ success: false })
        break
    }
  }