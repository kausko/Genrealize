import mongoose from 'mongoose'

const ArtistSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
})

export default mongoose.models.Artist || mongoose.model('Artist', ArtistSchema)