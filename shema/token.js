const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    refreshToken : {type : String, required : true},
    user : {type : mongoose.Types.ObjectId, ref : 'user'}
})


const tokenModel = mongoose.model('token', schema);

module.exports = tokenModel;