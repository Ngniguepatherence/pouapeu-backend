// Customer.js
const mongoose = require('mongoose');

const TontineSchema = new mongoose.Schema({
  
  
  membre: { type: String, required: true },
  type_cotisation: { type: String, required: true },
  Montant: { type: String, required: true },
  Beneficiaire: { type: Boolean, required: true },
  createat: {
    type: Date,
    required: true,
    default: Date.now()
},
status: { type: String, required: true },
 
  
});

const Tontine = mongoose.model('Tontine', TontineSchema);
module.exports = Tontine;