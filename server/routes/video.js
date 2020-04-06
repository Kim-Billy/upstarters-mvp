const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
let ffmpeg = require("fluent-ffmpeg")


// Strage Multer Config
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");


//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    // client에서 받은 video를 서버에 저장한다. => multer 이용
    upload(req, res, err => {
        if(err) {
            return res.json({success: false, err})
        } else {
            return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
        }
    })
})


router.post('/uploadVideo', (req, res) => {
    // video 정보들을 DB에 저장한다. 
    const video = new Video(req.body)
    video.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})


router.get('/getVideos', (req, res) => {
    // video를 db에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate('writer') // 모든 정보를 가져오기 위해 populate 사용
        .exec((err, videos) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, videos})
        })
})

router.post("/getVideoDetail", (req,res) => {
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json( {success: true, videoDetail })
        })
})


router.post('/thumbnail', (req, res) => {
    //  thumbnail 생성 및 video 러닝타임 가져오기

    let filePath = ""
    let fileDuration = ""

    // fetch the vedio info.abs 
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    // thumbnail 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames) {
        console.log('will generate' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration })
    })
    .on('error', function(err) {
        console.log(err);
        return res.json({ success: false, err });
    })
    .screenshot({
        // will take screenshots at 20%, 40%, 60%, and 80% or the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        // '%b : input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })


})

module.exports = router;
