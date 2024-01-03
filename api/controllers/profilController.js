const profil = require('../models/profil');
const jwt = require('jsonwebtoken');

const secret = "je vous en prie";


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
            const { email, password } = req.body;
            const Profil = await profil.findOne({email});
            if(!Profil) {
                return res.status(404).json({message: "Profil not found"});
            }
            if (password != Profil.password) {
                return res.status(401).json({error: 'Invalid Username or password'});
            }
            const token = jwt.sign({userId: Profil}, secret, {expiresIn: '1h'});
            console.log(token);
            res.status(200).json({token, expiresIn: 3600});
        }catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },


    addProfil: async (req,res) => {
        try {
            const {password, passwordConfirm} = req.body;
            if (password == passwordConfirm) {
                const newProfil = new profil(req.body);
            await newProfil.save();
            res.status(200).json({
                message: "Profile successful created",
                newProfil,
                });
            }
            
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
    },

    // delete profiler
    deleteProfil: async (req,res) => {
        try {
            const {id} = req.params;
            await profil.findByIdAndDelete(id);
            res.json({success: true});
        } catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        } 
    
    }
}

module.exports = profilController;