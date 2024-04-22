// Customer.js
const mongoose = require('mongoose');
const Seance = require('./seance');
const Profile = require('./profil');

const ParticipationSchema = new mongoose.Schema({
  
    membre: { 
        type: mongoose.Types.ObjectId, 
        ref: Profile,
        required: true 
    },
    presence : {type: Boolean, require: true},
    retardataire: {type: Boolean, require: true},
    montant_tontine: {type: Number, require: false},
    montant_plat: {type: Number, require: false},
    montant_prelevement_social: {type: Number, require: false},
    montant_sanction: {type: Number, require: false},
    motif_sanction: {type: String, require: false},

    seance: {
        type: mongoose.Types.ObjectId,
        ref: 'Seance',
        reqrequireduire: true
    }, 

    createat: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: { type: String, required: false },
    
  
});

const ParticipationSeance = mongoose.model('ParticipationSeance', ParticipationSchema);
module.exports = ParticipationSeance;