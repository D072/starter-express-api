const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const LoginPanel = new Schema({
    fname : String,
    email : String,
    username : {
       type: String,
       unique: true
    },
    password : String,
    
});

const LOGIN = mongoose.model('login', LoginPanel);
module.exports = LOGIN;
