// Customer.js
const mongoose = require('mongoose');
const Seance = require('./seance');
const Profile = require('./profil');
const Inscription = require('./inscription_saison');
const Sanctions = require('./sanctions');
const Transaction = require('./transaction');

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

    trans_montant_tontine: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},
    trans_montant_plat: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},
    trans_montant_prelevement_social: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},
    
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

const autoUpdateTrans =  async function (next) {

    let participation = this

    if (this instanceof mongoose.Query) {
        participation = this.getUpdate()
    }
    
    
    let trans_montant_tontine = await Transaction.findOne({ reference: "participation_trans_montant_tontine" + participation._id })
    let trans_montant_plat = await Transaction.findOne({ reference: "participation_trans_montant_plat" + participation._id })
    let trans_montant_prelevement_social = await Transaction.findOne({ reference: "participation_trans_montant_prelevement_social" + participation._id })

    if(!trans_montant_tontine){
        
        trans_montant_tontine = new Transaction({
            montant: participation.montant_tontine ,
            type: 'input',
            date: new Date(),
            saison: participation.saison,
            description: 'Transaction liée a l\'encaissement montant tontine de la participation '+ participation._id,
            reference: "participation_trans_montant_tontine" + participation._id
        });
        await trans_montant_tontine.save();
        participation.trans = trans_montant_tontine._id.toString()
    } else {
        trans_montant_tontine = await Transaction.findOneAndUpdate(
            { reference: "participation_trans_montant_tontine" + participation._id },
            { montant: participation.montant_tontine , },
            { new: true }
        );
    }

    if(!trans_montant_plat){
        
        trans_montant_plat = new Transaction({
            montant: participation.montant_plat,
            type: 'input',
            date: new Date(),
            saison: participation.saison,
            description: 'Transaction liée a l\'encaissement montant tontine de la participation '+ participation._id,
            reference: "participation_trans_montant_plat" + participation._id
        });
        await trans_montant_plat.save();
        participation.trans = trans_montant_plat._id.toString()
    } else {
        trans_montant_plat = await Transaction.findOneAndUpdate(
            { reference: "participation_trans_montant_plat" + participation._id },
            { montant: participation.montant_plat, },
            { new: true }
        );
    }

    if(!trans_montant_prelevement_social){
        
        trans_montant_prelevement_social = new Transaction({
            montant: participation.montant_prelevement_social,
            type: 'input',
            date: new Date(),
            saison: participation.saison,
            description: 'Transaction liée a l\'encaissement montant tontine de la participation '+ participation._id,
            reference: "participation_trans_montant_prelevement_social" + participation._id
        });
        await trans_montant_prelevement_social.save();
        participation.trans = trans_montant_prelevement_social._id.toString()
    } else {
        trans_montant_prelevement_social = await Transaction.findOneAndUpdate(
            { reference: "participation_trans_montant_prelevement_social" + participation._id },
            { montant: participation.montant_prelevement_social, },
            { new: true }
        );
    }

    next();
}

ParticipationSchema.pre('updateOne',{ document: false, query: true },autoUpdateTrans);

ParticipationSchema.pre('save', autoUpdateTrans);

const ParticipationSeance = mongoose.model('ParticipationSeance', ParticipationSchema);
module.exports = ParticipationSeance;