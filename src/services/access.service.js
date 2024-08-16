'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")

//service//

const { findByEmail } = require("./shop.service")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /*
        check token used?
    */
    static handlerRefreshTokenV2 = async (keyStore, user, refreshToken) => {

        const { userId, email } = user;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend!! Pls relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!')

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registered! 2')

        //created pairToken
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }

    static handlerRefreshToken = async (refreshToken) => {
        //check token used
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        //if exist
        if (foundToken) {
            //decode check in system
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })

            //delete all token in keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend!! PLs relogin')
        }
        console.log('refreshToken:', refreshToken);
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        console.log('holderToken:', holderToken);
        if (!holderToken) throw new AuthFailureError('Shop not registered! 1')

        //verifyToken
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--', { userId, email })
        //check userId
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registered! 2')

        //created pairToken
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }


    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeTokenById(keyStore._id)
        console.log({ delKey })
        return delKey
    }

    /*
        1 - check email in dbs
        2 - match password
        3 - create AT vs RT and save
        4 - generate tokens
        5 - get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        //1.
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registered!')

        //2.
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        //3. created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4. generate tokens
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        //step1: check email exist?
        const hoderShop = await shopModel.findOne({ email }).lean()
        if (hoderShop) {
            throw new BadRequestError('Error: Shop already registered!')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            //Public key CryptoGraphy Standards !

            console.log({ privateKey, publicKey }) //save collection keyStore


            //create pair token
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'keyStore error'
                }
            }

            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Created Token Success::`, tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService