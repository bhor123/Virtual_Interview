const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    uuid: {type: String, required: false},
    path: {type: String, required: false},
    location: {type: Object, required: false},
})

module.exports = mongoose.model('User', UserSchema)