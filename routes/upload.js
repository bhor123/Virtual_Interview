const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const User = require('../models/User')
const { v4:uuidv4 } = require('uuid')
const getKyc = require('./getKycDoc')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random()*1e9)}${file.originalname}`
        cb(null, uniquename)
    }
})

let upload = multer({storage, limits: { filesize: 1000000 * 10 }}).single('testfile')

router.route('/kyc').post((req, res) => {
    upload(req, res, async err => {
        console.log(req.body);
        const geoL = {town: req.body.town, country: req.body.country, lat: req.body.lat, long: req.body.long, postcode: req.body.postcode};
        console.log(geoL)

        if(err) return res.status(500).send({error: err.message, test: "testing"})
        var user = await User.findByIdAndUpdate("618d2ebd469164877c6c9cbd", {path: req.file.path, location : geoL});

        res.json({file: `${process.env.APP_BASE_URL}/files/}`});
    })
})

router.route('/file-upload').post((req, res) => {
    upload(req, res, err => {
        if(err)
        {
            console.error(err);
            return res.status(500).send({error: err.message, test: "testing"})
        }
        console.log("File is - ", req.file.path);
        res.json({filename: req.file.path});
    })
})

router.route('/download').get((req, res) => {  
    console.log("query path", req.query.path);
    res.download(req.query.path, 'user-file.txt');
})

router.route('/kyc-update').get(async (req, res) => {
    var user = await User.findByIdAndUpdate("618d2ebd469164877c6c9cbd", {path: req.query.path})
    res.json({file: `${process.env.APP_BASE_URL}/files/sfsf`, message: "kyc updated"})
})

router.route('/fetch-kyc').get(async (req, res) => {
    const user = await User.findById("618d2ebd469164877c6c9cbd");
    // res.sendFile('./' + user.path);
    res.json({file: `${process.env.APP_BASE_URL}/files/${user.path}`, message: "kyc fetched"});
})

router.route('/get-location').get(async (req, res) => {
    const user = await User.findById("618d2ebd469164877c6c9cbd");
    console.log("kyc loc maangra", user);
    // res.sendFile('./' + user.path);
    res.json({location: user.location, message: "location fetched"});
})

router.route('/add').post(async (req, res) => {
    const uuid = req.query.uuid
    const user = await User.create({
        path: "NULL",
        uuid 
    })
    // await user.save();
    console.log(user)
    res.status(200).json({tatti: "mast tatti"})
})

router.route('/').get(async (req, res) => {
    const file = await getKyc("2829135f-3ca7-424f-b173-3364609dc0fc")
    console.log("file found = ", file)
    if(!file) return res.status(404).json({error: "file not found" })
    return res.download(file.path, err => console.log(err))
})

module.exports = router