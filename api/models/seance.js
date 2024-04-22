const Mongoose = require('mongoose');
const Profile = require('./profil');
const ParticipationSeance = require('./participation_sceance');

const SeanceSchema = new Mongoose.Schema({
    date: {
        type: String,
        required: true,
    },

    session: {
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
        required: false,
    },

    beneficaire_tontine: {
        type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
        ref: Profile
    },

    beneficaire_plat: {
        type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
        ref: Profile
    },

    participations: [
        {
            type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
            ref: ParticipationSeance
        }
    ],

    // plat
    recette_total_plat: { type: Number, required: false },
    echec_plat : { type: Number, required: false },
    montant_receptioniste: { type: Number, required: false },
    solde_contribution__plat: { type: Number, required: false },
    
    // tontine
    recette_total_tontine: { type: Number, required: false },
    echec_tontine : { type: Number, required: false },
    montant_beneficiaire: { type: Number, required: false },
    montant_demi_non_decaisse: { type: Number, required: false },
    solde_caisse_tontine: { type: Number, required: false },

    // Controbution social
    cs_membre_non_tontinar : { type: Number, required: false },
    cs_membre_tontinar : { type: Number, required: false },
    cs_total : { type: Number, required: false },
    echec_cs : { type: Number, required: false },
    solde_cs : { type: Number, required: false },
  });

const Seance = Mongoose.model('Seance', SeanceSchema);
module.exports = Seance;