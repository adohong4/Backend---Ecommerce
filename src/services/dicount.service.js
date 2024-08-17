'use strict'

const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { productModel } = require("../models/product.model")
const { findAllDiscountCodesUnSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")
/*
    discount services
    1- genertor Discount code(shop | admin)
    2- Get discount amount (user)
    3- get all discount code (users\ shop)
    4- verify discount code(user)
    5- delete discount code (admin|shop)
    6- cancel discount code (user)
*/

class DiscountService {

    static async createDiscountcode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload
        //check
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount codes has expried')
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }

        //create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, // percentage
            discount_value: value, // 10.000 , 10
            discount_code: code, // discountCode
            discount_start_date: new Date(start_date), // ngay bat dau
            discount_end_date: new Date(end_date), // ngay ket thuc
            discount_max_uses: max_uses, // so luong discount duoc ap dung
            discount_uses_count: uses_count, // so discount da su dung
            discount_users_used: users_used, // ai da sung
            discount_max_uses_per_user: max_uses_per_user, // so luong cho phep toi da dung
            discount_max_value: max_value,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids // so san pham duoc ap dung
        })

        return newDiscount
    }

    //update
    static async updateDiscountCode() {
        return await updateProductById({ productId, bodyUpdate, model: productModel })
    }


    //Get all discount codes available with products

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        //create index for discount_code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('discount not exist')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'all') {
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            //get all products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products;
    }

    //Get all discount code of shop

    static async getAllDiscountCodesByProduct(limit, page, shopId) {
        const discounts = await findAllDiscountCodesUnSelect({
            limt: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })

        return discounts;
    }
}