const Mongoose = require('mongoose');
const Profile = require('./profil');
const { default: mongoose } = require('mongoose');
const Saison = require('./saison');
const Sanctions = require('./sanctions');
const Inscription = require('./inscription_saison');
const Transaction = require('./transaction');
const transactionRepositorie = require('../repositories/transsaction');

const checkAndApplyTrans = transactionRepositorie.checkAndApplyTrans
const SeanceSchema = new Mongoose.Schema({
    date: {
        type: String,
        required: true,
    },

    saison: {
        type: mongoose.Types.ObjectId,
        ref: Saison,
        required: true,
    },
    
    effectif: {
        type: String,
        required: false,
    },

    beneficaire_tontine1: {
        type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
        ref: Inscription
    },

    beneficaire_tontine2: {
        type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
        ref: Inscription
    },

    beneficaire_plat: {
        type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
        ref: Inscription
    },

    participations: [
        {
            type: Mongoose.Schema.Types.ObjectId, // Référence à un modèle d'utilisateur
            ref: 'ParticipationSeance'
        }
    ],

    sanctions: [
        {
            type: Mongoose.Schema.Types.ObjectId,
            ref: Sanctions
        }
    ],

    // plat
    recette_total_plat: { type: Number, required: false },
    echec_plat : { type: Number, required: false },
    montant_receptioniste: { type: Number, required: false },
    trans_montant_receptioniste: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},
    solde_contribution__plat: { type: Number, required: false },
    
    // tontine
    recette_total_tontine: { type: Number, required: false },
    echec_tontine : { type: Number, required: false },

    montant_beneficiaire1: { type: Number, required: false },
    trans_montant_beneficiaire1: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},

    montant_beneficiaire2: { type: Number, required: false },
    trans_montant_beneficiaire2: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},

    montant_enchere1: { type: Number, required: false },
    trans_montant_enchere1: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},

    montant_enchere2: { type: Number, required: false },
    trans_montant_enchere2: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},


    solde_caisse_tontine: { type: Number, required: false },

    // Controbution social
    cs_membre_non_tontinar : { type: Number, required: false },
    cs_membre_tontinar : { type: Number, required: false },
    cs_total : { type: Number, required: false },
    echec_cs : { type: Number, required: false },
    solde_cs : { type: Number, required: false },
  });

  const autoUpdateTrans =  async function (next) {
    let seance = this

    if (this instanceof mongoose.Query) {
        seance = this.getUpdate()
        if(seance._id){
            const base_seance = await Seance.findById(seance._id)
            console.log('seances :')
            console.log(seance)
            console.log(base_seance)
            if(seance.montant_beneficiaire1 == base_seance.montant_beneficiaire1 
                && seance.montant_beneficiaire2 == base_seance.montant_beneficiaire2
                && seance.montant_enchere1 == base_seance.montant_enchere1
                && seance.montant_enchere2 == base_seance.montant_enchere2
                && seance.montant_receptioniste == base_seance.montant_receptioniste ){
                console.log("Pas besoin de modifier les transaction")
                next()
            }
            seance.saison = base_seance.saison
        }
    }
    
    
    let trans_montant_receptioniste = await Transaction.findOne({ reference: "seance_trans_montant_receptioniste_" + seance._id })
    let trans_montant_beneficiaire1 = await Transaction.findOne({ reference: "seance_trans_montant_beneficiaire1_" + seance._id })
    let trans_montant_beneficiaire2 = await Transaction.findOne({ reference: "seance_trans_montant_beneficiaire2_" + seance._id })
    let trans_montant_enchere1 = await Transaction.findOne({ reference: "seance_trans_montant_enchere1_" + seance._id })
    let trans_montant_enchere2 = await Transaction.findOne({ reference: "seance_trans_montant_enchere2_" + seance._id })

    await checkAndApplyTrans(trans_montant_receptioniste, 'montant_receptioniste',seance,seance.saison, "seance_trans_montant_receptioniste", "output", "Transaction liée au décaissement du receptioniste de la seance")
    await checkAndApplyTrans(trans_montant_beneficiaire1, 'montant_beneficiaire1',seance,seance.saison, "seance_trans_montant_beneficiaire1", "output", "Transaction liée au décaissement du bouffeur 1 de la seance")
    await checkAndApplyTrans(trans_montant_beneficiaire2, 'montant_beneficiaire2',seance,seance.saison, "seance_trans_montant_beneficiaire2", "output", "Transaction liée au décaissement du bouffeur 2 de la seance")
    await checkAndApplyTrans(trans_montant_enchere1, 'montant_enchere1',seance,seance.saison, "seance_trans_montant_enchere1", "input", "Transaction liée a l'encaissement de l'enchère 1 de la seance")
    await checkAndApplyTrans(trans_montant_enchere2, 'montant_enchere2',seance,seance.saison, "seance_trans_montant_enchere2", "input", "Transaction liée a l'encaissement de l'enchère 2 de la seance")

    next();
}


SeanceSchema.pre('updateOne',{ document: false, query: true },autoUpdateTrans);

SeanceSchema.pre('save', autoUpdateTrans);

const Seance = Mongoose.model('Seance', SeanceSchema);
module.exports = Seance;
exports.checkAndApplyTrans = checkAndApplyTrans;