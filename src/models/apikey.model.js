'use strict'

//mission: save token from date that to date this

const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const apiKeyModel = mongoose.model.apiKey || mongoose.model(DOCUMENT_NAME, apiKeySchema);

module.exports = apiKeyModel;