const mongoose = require('mongoose');
const Inscription = require('./inscription_saison')
const MotifSanction = require('./motif_sanction');
const Saison = require('./saison');

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

const Sanctions = mongoose.model('Sanctions', SanctionSchema);
module.exports = Sanctions;