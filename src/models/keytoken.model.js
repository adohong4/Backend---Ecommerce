'use strict'

const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: Array, default: []
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const keyTokenModel = mongoose.model.keyToken || mongoose.model(DOCUMENT_NAME, keyTokenSchema);


//Export the model
module.exports = keyTokenModel;