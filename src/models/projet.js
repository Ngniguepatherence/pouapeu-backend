const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type:String,
        required: true,
    },
    responsable: {
        type:String,
        unique:true,
        required:true,
    },
    logo: {
        type:String,
        require: false,
    },
    createat: {
        type: String,
        require: true,
        unique: true,
    }
    
  });

const Projet = Mongoose.model('Projet', userSchema);
module.exports = Projet;