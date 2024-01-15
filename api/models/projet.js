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
        type: String, // Référence à un modèle d'utilisateur
        required: true,
      },
    logo: {
        type:String,
        require: false,
    },
    dateinit: {
        type: String,
        require: true,
    },
    createat: {
        type: Date,
        required: true,
        default: Date.now()
    }
    
  });

const Projet = Mongoose.model('Projet', userSchema);
module.exports = Projet;