require('dotenv').config()
const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_CONN_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => console.log("DB Connected"))
    .catch(err => console.log(err))
}

module.exports = connectDB