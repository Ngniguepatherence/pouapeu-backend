const Projet = require('../models/projet');
const asyncHandler = require('express-async-handler');
const Profile = require('../models/profil');

const ProjetController = {
    // upload image
    uploadImage : asyncHandler(async (req, res) => {
        try {
            if (req?.files?.length) {
                console.log(req.files);
                let uploadedFiles = req?.files?.map((image) => {
                    return { img: image.filename };
                });
                res.status(200).send({
                    success: true,
                    messsage: "Files Uploaded",
                    data: uploadedFiles,
                });
            } else {
                console.log("Something is missing.");
                res.status(400).send({ success: false, messsage: "Send Files." });
            }
        } catch (err) {
            console.log("error", err);
            res.status(503).send({ success: false, messsage: "Server Error." });
        }
    }),


    getProjet: async (req, res) => {
        try {
            const projets = await Projet.find();
            res.json(projets);
        } catch(error) {
            res.status(500).json({message: "Internal Server Error" });
        }
    },
    getProjetId: async (req,res) => {
        try {
            const {id}  = req.params;
            const projet = await Projet.findById(id);
            if(!projet) {
                res.status(404).json({message: "Projet not found"});
            }
            res.json(projet);
        }
        catch(error) {
            res.status(500).json({message: "Internal Server ERROR"});
        }
    },

    addProjet: async (req, res) => {
        const {title,description, responsable,logo, dateinit} = req.body;
        
        // try {
            
            console.log(title,description,responsable,dateinit,logo);
            // Vérifiez si l'utilisateur existe avant de créer l'événement
            const user = await Profile.findById(responsable);
            if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            const newProjet = new Projet({
                title,
                description,
                responsable: `${user.name + ' ' + user.surname}`, 
                logo,
                dateinit
            });
            await newProjet.save();
            res.status(200).json({
                message: "projet successful created",
                newProjet,
                });
        // }
        // catch(error) {
        //     res.status(401).json({
        //         message: "Projet not successful created",
        //         error: error.message,
        //     });
        // }
    },

    deleteProjet: async (req, res) => {
        try {
            const {id}  = req.params;
            await Projet.findByIdAndDelete(id);
            
            res.json({message: "Projet Remove Successfully"});
            
        }
        catch(error) {
            res.status(500).json({message: "Internal Server ERROR"});
        } 
    }
}



module.exports = ProjetController;