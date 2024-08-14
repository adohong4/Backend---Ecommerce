'use strict'

const AccessService = require("../services/access.service")
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }


    signUp = async (req, res, next) => {
        // return res.status(201).json({
        //     message: '',
        //     metadata:
        // })
        new CREATED({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()