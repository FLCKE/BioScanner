const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const localSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    nom: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    rayon: {
        type: Number,
        required: true // en mètres
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Local', localSchema);
