import mongoose from 'mongoose';
const artist = new mongoose.Schema({
    name:{
        type: String,
    }
})
const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artists: {
        type: [artist],
        required: true,
    },
    duration:{
        type: Number,
    },
    ytData:{
        type: Object
    }
})
module.exports = mongoose.model('Song', songSchema);
