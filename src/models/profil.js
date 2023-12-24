// Customer.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  address: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String, required: true },
  },
  avatar: { type: String, required: true },
  createdAt: { type: Date, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  google: {
    id: {
        type: String,
    },
    name: {
        type:String,
    },
    email: {
        type: String,
    },
    photo: {
        type: String,
    },
},
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;