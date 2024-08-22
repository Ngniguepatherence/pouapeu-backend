const Mongoose = require('mongoose');
const Profile = require('./profil');
const { default: mongoose } = require('mongoose');
const Saison = require('./saison');
const Sanctions = require('./sanctions');
const Inscription = require('./inscription_saison');
const Transaction = require('./transaction');

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

    beneficaire_tontine: {
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
    montant_beneficiaire: { type: Number, required: false },
    trans_montant_beneficiaire: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},
    montant_demi_non_decaisse: { type: Number, required: false },
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
            if(seance.montant_beneficiaire == base_seance.montant_beneficiaire && seance.montant_receptioniste == base_seance.montant_receptioniste ){
                console.log("Pa besoin de modifier les transaction")
                next()
            }
            seance.saison = base_seance.saison
        }
    }
    
    
    let trans_montant_receptioniste = await Transaction.findOne({ reference: "seance_trans_montant_receptioniste_" + seance._id })
    let trans_montant_beneficiaire = await Transaction.findOne({ reference: "seance_trans_montant_beneficiaire_" + seance._id })

    if(!trans_montant_receptioniste){
        
        trans_montant_receptioniste = new Transaction({
            montant: seance.montant_receptioniste ,
            type: 'output',
            date: new Date(),
            saison: seance.saison,
            description: 'Transaction liée au décaissement du receptioniste de la seance '+ seance._id,
            reference: "seance_trans_montant_receptioniste_" + seance._id
        });
        await trans_montant_receptioniste.save();
        seance.trans_montant_receptioniste = trans_montant_receptioniste._id.toString()
    } else {
        trans_montant_receptioniste = await Transaction.findOneAndUpdate(
            { reference: "seance_trans_montant_receptioniste_" + seance._id },
            { montant: seance.montant_receptioniste , date: new Date()},
            { new: true }
        );
    }

    if(!trans_montant_beneficiaire){
        
        trans_montant_beneficiaire = new Transaction({
            montant: seance.montant_beneficiaire,
            type: 'output',
            date: new Date(),
            saison: seance.saison,
            description: 'Transaction liée décaissement du bouffeur de la seance '+ seance._id,
            reference: "seance_trans_montant_beneficiaire_" + seance._id
        });
        await trans_montant_beneficiaire.save();
        seance.trans_montant_beneficiaire = trans_montant_beneficiaire._id.toString()
    } else {
        trans_montant_beneficiaire = await Transaction.findOneAndUpdate(
            { reference: "seance_trans_montant_beneficiaire_" + seance._id },
            { montant: seance.montant_beneficiaire,date: new Date() },
            { new: true }
        );
    }

    next();
}

SeanceSchema.pre('updateOne',{ document: false, query: true },autoUpdateTrans);

SeanceSchema.pre('save', autoUpdateTrans);

const Seance = Mongoose.model('Seance', SeanceSchema);
module.exports = Seance;