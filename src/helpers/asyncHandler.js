'use strict'

const { findById } = require("../services/apikey.service")


const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}


module.exports = {
    asyncHandler
}