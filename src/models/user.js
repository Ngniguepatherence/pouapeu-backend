const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    names: {
        type:String,
        unique:true,
        required:true,
    },
    surname: {
        type:String,
        unique:true,
        required: false,
    },
    email: {
        type:String,
        unique:true,
        required:true,
    },
    phone: {
        type:String,
        unique: true,
        require: true,
    },
    profession: {
        type:String,
        unique:false,
        required: true
    },
    password: {
        type:String,
        unique: true,
        minlength: 8,
        required: true,
    },
    role: {
        type: String,
        default: 'Basic',
        required: true,
    },
  });

const User = Mongoose.model('User', userSchema);
module.exports = User;