const mongoose = require('mongoose');
const Inscription = require('./inscription_saison')
const MotifSanction = require('./motif_sanction');
const Saison = require('./saison');
const Transaction = require('./transaction');

const SanctionSchema = new mongoose.Schema({
    motif: {
        type: mongoose.Types.ObjectId,
        ref: MotifSanction,
        require: true
    },
    
    inscrit: {
        type: mongoose.Types.ObjectId,
        ref: Inscription,
        require: true
    },
    trans: {type: mongoose.Schema.Types.ObjectId, ref: Transaction},

    date: {
        type: Date,
    },

    paye: {
        type: Boolean,
        default: false
    },

    saison: {
        type: mongoose.Types.ObjectId,
        ref: Saison
    }
    

});


const autoUpdateTrans =  async function (next) {

    let sanction = this
    if (this instanceof mongoose.Query) {
        sanction = this.getUpdate()
    }
    
    const motif = await MotifSanction.findById(sanction.motif)
    
    let transaction = await Transaction.findOne({ reference: "Sanction_" + sanction._id })
    if(!transaction){
        
        transaction = new Transaction({
            montant: sanction.paye ? motif.cout :0 ,
            type: 'input',
            date: new Date(),
            saison: sanction.saison,
            description: 'Transaction liée à une sanction',
            reference: "Sanction_" + sanction._id
        });
        await transaction.save();
        sanction.trans = transaction._id.toString()
    } else { // Si la sanction existe déjà, met à jour la transaction
        transaction = await Transaction.findOneAndUpdate(
            { reference: "Sanction_" + sanction._id },
            { montant: sanction.paye? motif.cout :0 , },
            { new: true }
        );
    }

    next();
}

SanctionSchema.pre('updateOne',{ document: false, query: true },autoUpdateTrans);

SanctionSchema.pre('save', autoUpdateTrans);

const Sanctions = mongoose.model('Sanctions', SanctionSchema);
module.exports = Sanctions;