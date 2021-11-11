const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    filename: { type: String, required: false },
    path: { type: String, required: false },
    size: { type: Number, required: false },
    uuid: { type: String, required: false },
})

module.exports = mongoose.model('File', FileSchema)