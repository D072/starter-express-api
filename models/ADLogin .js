const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ADLoginPanel = new Schema({
    username : {
       type: String,
       unique: true
    },
    password : String,
    
});

const ADLOGIN = mongoose.model('ADlogin', ADLoginPanel);
module.exports = ADLOGIN;
