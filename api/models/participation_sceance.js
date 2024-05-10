// Customer.js
const mongoose = require('mongoose');
const Seance = require('./seance');
const Profile = require('./profil');
const Inscription = require('./inscription_saison');
const Sanctions = require('./sanctions');

const ParticipationSchema = new mongoose.Schema({
  
    inscrit: { 
        type: mongoose.Types.ObjectId, 
        ref: Inscription,
        required: true 
    },
    presence : {type: Boolean, require: true},
    retardataire: {type: Boolean, require: true},
    montant_tontine: {type: Number, require: false},
    montant_plat: {type: Number, require: false},
    montant_prelevement_social: {type: Number, require: false},
    
    sanctions : [{
        type: mongoose.Types.ObjectId,
        ref: Sanctions,
    }],

    seance: {
        type: mongoose.Types.ObjectId,
        ref: 'Seance',
        require: true
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