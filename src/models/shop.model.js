'use strict'
//key !dmbg install by Mongo Snippets for Node-js

const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const shopModel = mongoose.model.shop || mongoose.model(DOCUMENT_NAME, shopSchema);

//Export the model
module.exports = shopModel;