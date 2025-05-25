const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const pictureSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        ref: 'Users',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pictures', pictureSchema);