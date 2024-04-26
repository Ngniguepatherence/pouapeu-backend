const mongoose = require('mongoose');
const Inscription = require('./inscription_session');

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
    montant_contribution_plat: {
        type: Number,
        require: false
    },
    montant_un_nom: {
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