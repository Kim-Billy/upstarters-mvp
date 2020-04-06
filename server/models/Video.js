const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const videoSchema = mongoose.Schema({
    
    // id를 통해서 user 모델 데이터를 가져올 수 있다.
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    // 0: privacy 1: public
    privacy: {
        type: Number
    },
    filePath:{
        type: String
    },
    category: {
        type: String
    },
    // 조회수
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }

}, { timeStamps: true}) // 만든날, 업데이트 시각 기록


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }