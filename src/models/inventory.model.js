'use strict'

//mission: save token from date that to date this

const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


const inventoryModel = mongoose.model.inventory || mongoose.model(DOCUMENT_NAME, inventorySchema);

module.exports = inventoryModel;