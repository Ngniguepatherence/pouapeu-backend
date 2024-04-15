const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    
    type_seance: {
        type: String,
        required: true,
    },
    nbre_pers_tontinard: {
        type: String,
        required: false,
    },
    nbre_pers_non_tontinard: {
        type: String,
        required: false,
    },
    effectif: {
        type: String,
        required: true,
    }
    
    
  });

const Seance = Mongoose.model('Seance', userSchema);
module.exports = Seance;