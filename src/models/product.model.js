'use strict'

const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String
}, {
    collection: 'electronics',
    timestamps: true
})

const productModel = mongoose.model.product || mongoose.model(DOCUMENT_NAME, productSchema);
const clothingModel = mongoose.model.clothing || mongoose.model('Clothing', clothingSchema);
const electronicModel = mongoose.model.electronic || mongoose.model('Electronics', electronicSchema);

//Export the model
module.exports = { productModel, clothingModel, electronicModel };