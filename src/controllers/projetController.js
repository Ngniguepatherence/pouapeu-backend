const Projet = require('../models/projet');

const ProjetController = {
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
        const {title,description, responsable, logo,createat} = req.body;

        try {
            const newProjet = new Projet({title,description, responsable, logo,createat});
            await newProjet.save();
            res.status(200).json({
                message: "projet successful created",
                newProjet,
                });
        }
        catch(error) {
            res.status(401).json({
                message: "Projet not successful created",
                error: error.message,
            });
        }
    },

    deleteProjet: async (req, res) => {}
}



module.exports = ProjetController;