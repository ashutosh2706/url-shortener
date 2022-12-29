const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({

    full: {
        type: String,
        required: true
    },

    short: {
        type: String,
        required: true,
        default: 'null_value'
    },

    clicks: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)