const File = require('../models/file')

async function getKycDoc(uuid){
    console.log(uuid, "\nsearching...")
    try{
        const file = await File.findOne({ uuid })
        console.log(file)
        return file
    } catch(err){
        console.log(err)
        return null
    }
}

module.exports = getKycDoc