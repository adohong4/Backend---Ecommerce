'use strict'

const mongoose = require('mongoose')
require('dotenv').config();

const connectString = process.env.MONGO_CONNECTION_STRING
const { countConnect } = require('../helpers/check.connect')

class Database {
    constructor() {
        this.connect()
    }

    //connect
    connect(type = 'mongoddb') {
        if (1 == 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString)
            .then(_ => {
                console.log(`Connected Mongodb Success`, countConnect())

            })
            .catch(err => console.log(`Error Connect!`))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb