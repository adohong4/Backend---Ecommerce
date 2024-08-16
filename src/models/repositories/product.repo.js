'use strict'

const { productModel, electronicModel, clothingModel, furnitureModel } = require('../../models/product.model')
const { Types } = require('mongoose')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPulishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductsByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await productModel.find({
        isPublished: true,
        $text: { $search: regexSearch }
    },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
        .lean()

    return results
}

//-------------------Change Publish Or Drafts----------------
const publishProductByshop = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unPublishProductByshop = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}
//---------------END Change Publish Or Drafts----------------

const queryProduct = async ({ query, limit, skip }) => {
    return await productModel.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftsForShop,
    publishProductByshop,
    findAllPulishForShop,
    unPublishProductByshop,
    searchProductsByUser
}