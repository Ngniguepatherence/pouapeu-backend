const profil = require('../models/profil');

const profilController = {
    getProfils: async (req,res) => {
        try{
            const Profil = await profil.find();
            res.json(Profil);
        }catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },

    getProfil: async (req,res) => {
        try {
            const name = req.body;
            const Profil = await profil.findOne(name);
            if(!Profil) {
                return res.status(404).json({message: "Profil not found"});
            }
            res.json(Profil);
            console.log(Profil);
        }catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },


    addProfil: async (req,res) => {
        try {
            const newProfil = new profil(req.body);
            await newProfil.save();
            res.status(200).json({
                message: "Profile successful created",
                newUser,
                });
        }
        catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },
    // update of profil
    updateProfil: async (req,res) => {
        try {
            // recupere les infos et mets les a jour
            const {id} = req.params;
            const updateProfil = await profil.findByIdAndUpdate(id, req.body, {new: true});
            res.json({
                message: "Profile successful updated",
                updateProfil,
            });
        }
        catch(error) {
            res.status(500).json({message: "Internal Server Error during update"});
        }
    }
}

module.exports = profilController;