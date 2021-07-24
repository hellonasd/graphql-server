const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        
    },
    todo: [{
        type : mongoose.Types.ObjectId, ref : "todo"
    }]
})


const userModel = mongoose.model('user', schema);

module.exports = userModel;