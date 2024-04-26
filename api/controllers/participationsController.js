const ParticipationSeance = require("../models/participation_sceance")


const ParticipationsController = {
    getTontines: async  (req, res) => {
        try {
            const participations = await ParticipationSeance.find().populate(['membre', 'seance']).exec()

            const tontines = participations.map( p => ({
                membre: p.membre,
                momtant: p.montant_tontine,
                date: p.createat
            }))
            console.log(participations)
            res.json(participations.filter( elt => elt.montant_tontine > 0));
        }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
        }
    } ,

    getPlats: async  (req, res) => {
        try {
            const participations = await ParticipationSeance.find().populate(['membre', 'seance']).exec()

            const tontines = participations.map( p => ({
                membre: p.membre,
                momtant: p.montant_tontine,
                date: p.createat
            }))
            console.log(participations)
            res.json(participations.filter( elt => elt.montant_plat > 0));
        }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
        }
    } 
}

module.exports = ParticipationsController;