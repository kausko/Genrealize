import multer from "multer";
import nextConnect from "next-connect";
import { gimme, setGimmeKey } from 'gimme-the-song'
import { unlink } from 'fs'

const handler = nextConnect({
  onError: (err, _req, res) => { 
    console.log(err)
    res.status(501).json({ error: err.message })
   },
  onNoMatch: (req, res) => res.status(405).jaon({ error: req.method + " not allowed"})
})
.get((_req, res) => {
  res.status(200).json({ data: "test" })
})
.use(
  multer({ 
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename: (_req, file, cb) => cb(null, file.originalname.split(' ').join(''))
    })
  })
  .single('audiofile')
)
.post((req, res) => {
  setGimmeKey(process.env.ACOUSTIC_API_KEY)
  gimme(req.file.path, {}, data => {
    unlink(req.file.path, err => {
      if (err)
        throw err
      res.status(200).json(data)
    })
  })
})

export default handler

export const config = {
  api: {
    bodyParser: false
  }
}