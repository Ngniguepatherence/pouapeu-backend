const mongoose = require('mongoose');

const event = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile', // Référence à un modèle d'utilisateur
      required: true,
    },
    status: {
      type: String,
      enum: ['en cours', 'terminé'],
      default: 'en cours',
    },
  });

const Event = mongoose.model('Evenement', event);
module.exports = Event;