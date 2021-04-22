import mongoose from 'mongoose';
const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this playlist.'],
    maxlength: [20, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a email.'],
  },
  songs: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: 'Song'
  }],
  lastPlayedAt: {
    type: Date,
    default: null
  }
});

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema)
