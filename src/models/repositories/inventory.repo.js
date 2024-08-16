

const { Types } = require('mongoose')
const inventoryModel = require('../inventory.model')

const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shopId
    })
}

module.exports = {
    insertInventory
}