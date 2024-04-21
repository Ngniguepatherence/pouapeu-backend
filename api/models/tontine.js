// Customer.js
const mongoose = require('mongoose');
const Seance = require('./seance')

const TontineSchema = new mongoose.Schema({
  
  
  membre: { type: String, required: true },
  type_cotisation: { type: String, required: true },
  Montant: { type: String, required: true },
  seance: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: Seance 
  },
  createat: {
    type: Date,
    required: true,
    default: Date.now()
},
status: { type: String, required: true },
 
  
});

const Tontine = mongoose.model('Tontine', TontineSchema);
module.exports = Tontine;