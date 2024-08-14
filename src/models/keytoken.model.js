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
    privateKey: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array, default: []  //refresh token used
    },
    refreshToken: { type: String, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const keyTokenModel = mongoose.model.keyToken || mongoose.model(DOCUMENT_NAME, keyTokenSchema);


//Export the model
module.exports = keyTokenModel;