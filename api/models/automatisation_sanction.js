const mongoose = require('mongoose');
const MotifSanction = require('./motif_sanction');

const AutomatisationSanctionShema = new mongoose.Schema({
    code: {
        type:  String,
        require: true,
        unique: true,
        enum: ["ETAB","ETSP","ECSL","ECPT","RTRD","ABSC"]
    },

    label: {
        type:  String,
    },

    motif: {
        type: mongoose.Types.ObjectId,
        ref : MotifSanction,
    },

    actif: {
        type: Boolean
    }

});

const AutomatisationSanction = mongoose.model('AutomatisationSanction', AutomatisationSanctionShema);
module.exports = AutomatisationSanction;