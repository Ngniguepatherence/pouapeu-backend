const mongoose = require('mongoose');
const Saison = require('./saison');

const TransactionShema = new mongoose.Schema({
    montant: {
        type: Number,
        require: true
    },
    
    type: {
        type:  String,
        require: true,
        enum: ["input","output"]
    },

    date: {
        type: Date,
    },

    saison: {
        type: mongoose.Types.ObjectId,
        ref: Saison
    },
    
    description: {
        type: String,
    },

    reference: {
        type: String,
        require: true,
        unique: true,
    }

});

const Transaction = mongoose.model('Transaction', TransactionShema);
module.exports = Transaction;