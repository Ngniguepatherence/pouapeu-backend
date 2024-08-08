const mongoose = require('mongoose');
const Inscription = require('./inscription_saison');

const SaisonSchema = new mongoose.Schema({
    libelle: {
        type: String,
        require: true
    },
    date_debut: {
        type: Date,
        require: true
    },
    date_fin: {
        type: Date,
        require: true
    },
    montant_contribution_social: {
        type: Number,
        require: false
    },

    fond_caisse_minimal: {
        type: Number,
        require: true,
        default: 0
    },
    
    montant_contribution_plat: {
        type: Number,
        require: false
    },
    montant_un_nom: {
        type: Number,
        require: false
    },

    total_cotise_plat:{
        type: Number,
        require: false

    },
    total_decaisse_plat:{
        type: Number,
        require: false
    },

    total_cotise_tontine:{
        type: Number,
        require: false
    },
    total_decasse_tontine:{
        type: Number,
        require: false
    },

    total_prelevement_social:{
        type: Number,
        require: false
    },

    participants: [
        {
            type: mongoose.Types.ObjectId,
            ref: Inscription
        }
    ]

});

const Saison = mongoose.model('Saison', SaisonSchema);
module.exports = Saison;