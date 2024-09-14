const mongoose = require('mongoose');
const Profile = require('./profil');
const { checkAndApplyTrans } = require('./seance');
const Saison = require('./saison');
const Transaction = require('./transaction');


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

    saison: {
        type: mongoose.Types.ObjectId,
        ref: "saison",
        required: true,
    },

    fond_caisse: { type: Number, required: false },
    trans_fond_caisse: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},
});

const autoUpdateTrans =  async function (next) {
    let inscription = this

    if (this instanceof mongoose.Query) {
        inscription = this.getUpdate()
        if(inscription._id){
            const base_inscription = await Inscription.findById(inscription._id)
            if(inscription.fond_caisse == base_inscription.fond_caisse ){
                next()
            }
            inscription.saison = base_inscription.saison
        }
    }
    
    
    let trans_fond_caisse = await Transaction.findOne({ reference: "inscription_trans_fond_caisse_" + inscription._id })
 
    await checkAndApplyTrans(trans_fond_caisse, 'fond_caisse',inscription,inscription.saison, "inscription_trans_fond_caisse", "input", "Transaction liée a l'encaissement du fond de caisse de l'inscription")

    next();
}

InscriptionSchema.pre('updateOne',{ document: false, query: true },autoUpdateTrans);

InscriptionSchema.pre('save', autoUpdateTrans);

const Inscription = mongoose.model('Inscription', InscriptionSchema);
module.exports = Inscription;
