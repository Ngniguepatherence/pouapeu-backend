const Seance = require('../models/seance');


const SeanceController = {
    addSeance: async (req, res) => {
        try {
            const { date, type_seance, nbre_pers_tontinard, nbre_pers_non_tontinard,effectif} = req.body;

            const seance = new Seance({
                date: date, type_seance: type_seance, nbre_pers_tontinard: nbre_pers_tontinard, nbre_pers_non_tontinard: nbre_pers_non_tontinard, effectif
            });
            await seance.save();

            return res.status(201).json(seance);
        }
        catch (error) {
            res.status(500).json({error: 'Erreur lors de la creation de la seance'})
        }
    },


    getALL: async (req, res) => {
        try {
            const seances = await Seance.find();
            res.json(seances);
        } catch(error) {
            res.status(500).json({message: "Internal Server Error" });
        }
    
    },
    // UpdateSeance: async (req,res) =>{
    //     try {
    //         const seance = await Seance.findOneAndUpdate(
    //             req.params.seanceId,
    //             {

    //             }

    //         )
    //     }
    // }
}

module.exports = SeanceController;