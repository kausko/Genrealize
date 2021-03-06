import multer from "multer";
import nextConnect from "next-connect";
import { gimme, setGimmeKey } from 'gimme-the-song'
import { unlink } from 'fs'
import { tmpdir } from 'os'
import ytsr from 'ytsr'
import Playlist from "../../models/Playlist";

const handler = nextConnect({
  onError: (err, _req, res) => { 
    console.log(err)
    res.status(501).json({ error: err.message })
   },
  onNoMatch: (req, res) => res.status(405).json({ error: req.method + " not allowed"})
})
.get((req, res) => {
  ytsr(req.query?.q || 'Never gonna give you up Rick Astley', { limit: 5 })
  .then(ytres => {
    const ytdata = ytres.items.find(item => item.type === 'video')
    res.status(200).json(ytdata)
  })
})
.delete((req, res) => {
  const { playlist, song } = req.query
  Playlist.updateOne(
    { _id: playlist },
    { $pull: { songs: song }}
  ).then(resp => res.status(200).json(resp))
})
.use(
  multer({ 
    storage: multer.diskStorage({
      destination: tmpdir(),
      filename: (_req, file, cb) => cb(null, file.originalname.split(' ').join(''))
    })
  })
  .single('audiofile')
)
.post((req, res) => {
  setGimmeKey(process.env.ACOUSTIC_API_KEY)
  gimme(req.file.path, {}, ({ track, trackVariants }) => {
    unlink(req.file.path, err => {
      if (err)
        throw err
      res.status(200).json({
        track,
        trackVariants: trackVariants.filter(variant => !!variant.title && track.title !== variant.title)
      })
    })
  })
})

export default handler

export const config = {
  api: {
    bodyParser: false
  }
}