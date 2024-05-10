const Inscription = require("../models/inscription_saison");
const Saison = require("../models/saison")

const saisonController = {
    addSaison: async (req, res) => {
        console.log(req.body)

        try{
            var saison = new Saison(req.body)
            await saison.save();

            console.log('saison',saison)
            return res.status(201).json(saison);

        }catch(err){
            console.error(err)
            es.status(500).json({error: 'Erreur lors de la creation de la saison'})
        }
    },

    getAll: async(req,res) => {
        try {
            const saisons = await Saison.find().populate({
                path:'participants',
                populate: 'membre'
            })
            console.log(saisons)
            res.json(saisons);
        }catch(err){
            console.error(err)
            res.status(500).json({error: 'internal server error'})
        }

    },

    getOne: async(req,res) => {
        try {
            const saison = await Saison.findById(req.params.id)
            await saison.populate({
                path:'participants',
                populate: 'membre'
            })

            console.log(saison)

            res.json(saison);
        }catch(err){
            console.error(err)
            es.status(500).json({error: 'internal server error'})
        }

    },

    addInscription: async (req,res) => {
        try {
            const inscription = new Inscription(req.body)
            await inscription.save()

            const saison = await Saison.findById(req.params.id)
            await saison.populate({
                path:'participants',
            })

            saison.participants.push(inscription)
            await saison.save()

            await saison.populate({
                path:'participants',
            })
            console.log(saison)

            res.json(saison);
        }catch(err){
            console.error(err)
            es.status(500).json({error: 'internal server error'})
        }
    }
}

module.exports = saisonController