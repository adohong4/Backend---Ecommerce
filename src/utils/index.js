'use strict'

const _ = require('lodash')

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

// ['a','b'] = {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a','b'] = {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUnderfinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}


module.exports = {
    getInfoData, getSelectData, unGetSelectData, removeUnderfinedObject
}