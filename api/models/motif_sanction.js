const mongoose = require('mongoose');

const MotifSanctionSchema = new mongoose.Schema({
    libelle: {
        type: String,
        require: true
    },
    
    cout: {
        type: Number,
        require: true
    }

});

const MotifSanction = mongoose.model('MotifSanction', MotifSanctionSchema);
module.exports = MotifSanction;