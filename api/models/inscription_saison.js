const mongoose = require('mongoose');
const Profile = require('./profil');

const InscriptionSchema = new mongoose.Schema({
    membre: {
        type: mongoose.Types.ObjectId,
        ref : Profile,
    },
    nombre_de_noms: {
        type: Number,
        require: true
    },

    nombre_de_bouf: {
        type: Number,
        require: false,
        default: 0
    },

    nombre_de_reception: {
        type: Number,
        require: false,
        default: 0
    },
});

const Inscription = mongoose.model('Inscription', InscriptionSchema);
module.exports = Inscription;
