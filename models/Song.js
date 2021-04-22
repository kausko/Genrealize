import mongoose from 'mongoose';
const songSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    artists: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artist'
    }],
    ytData:{
        type: Object
    }
})

export default mongoose.model('Song', songSchema)
