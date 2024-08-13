'use strict'

const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://shopDEV:hhjkweqbvfx8@microservices.rzno6.mongodb.net/?retryWrites=true&w=majority&appName=Microservices`)
    .then(_ => console.log(`Connected Mongodb Success`)).catch(err => console.log(`Error Connect!`))

if (1 === 0) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose