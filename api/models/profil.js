// Customer.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  address: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  avatar: { type: String, required: false },
  createat: {
    type: Date,
    required: true,
    default: Date.now()
},
  email: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  profession: { type: String, required: true },
  phone: { type: String, required: true },
  role: {type: String, required: true},
  password: {type: String, required: true},
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