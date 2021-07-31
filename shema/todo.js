const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
        message : {type : String},
        favorite : {type : Boolean},
        completed : {type : Boolean},
        created : {type : Date},
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    
    
})

const todoModel = mongoose.model('todo', schema);

module.exports = todoModel;