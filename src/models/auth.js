const mongoose = require('mongoose');

const auth = new mongoose.Schema({
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

const Auth = mongoose.model('Auth', auth);
module.exports = Auth;