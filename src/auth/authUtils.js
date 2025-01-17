'use strict'

const JWT = require('jsonwebtoken')
const crypto = require('crypto')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',

        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',

        })

        //

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1- check userId missing???
        2- get AccessToken
        3- verifyToken
        4- check user in bds?
        5- chech keyStore with this userId?
        6- OK all => return next()
    */

    // 1
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userId) throw new AuthFailureError('Invalid Request UserId')


    //2
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if (!accessToken) throw new AuthFailureError('Invalid Requested')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    // 1
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userId) throw new AuthFailureError('Invalid Request UserId')


    //2
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //3

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]?.toString()
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid')
            req.keyStore = keyStore
            req.user = decodeUser //userId && email
            req.refreshToken = refreshToken
            console.log("DECODE: ", decodeUser);
            return next()

        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if (!accessToken) throw new AuthFailureError('Invalid Requested')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}