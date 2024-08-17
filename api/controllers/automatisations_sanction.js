const AutomatisationSanction = require("../models/automatisation_sanction")
const automatisationSanctionRepositorie  = require("../repositories/automatisation_sanction")

const automatisationSanctionController = {
    get_automatisations_possible: async (req, res)=> {
        try{
            const automatisation_sanctions = await AutomatisationSanction.find().populate('motif')
            const auto_possible = automatisationSanctionRepositorie.get_automatisations_possible().filter((auto,index)=>{
               return automatisation_sanctions.find(elt => elt.code === auto.code) == undefined
            })
            res.status(200).json(auto_possible);
        }catch (err) {
            console.error(err)
            res.status(500).json({error: 'internal server error'})
        }
    },

    get_automatisations: async  (req, res)=> {
        try{
            const automatisation_sanctions = await AutomatisationSanction.find().populate('motif')
            res.status(200).json(automatisation_sanctions);
        }catch (err) {
            console.error(err)
            res.status(500).json({error: 'internal server error'})
        }
    },

    add: async (req, res) => {
        console.log(req.body)

        try{
            var automatisation_sanction = new AutomatisationSanction(req.body)
            await automatisation_sanction.save();

            await automatisation_sanction.populate('motif')
            console.log('automatisation sanction',automatisation_sanction)
            return res.status(201).json(automatisation_sanction);

        }catch(err){
            console.error(err)
            es.status(500).json({error: 'Erreur lors de la creation de l\' automatisation'})
        }
    },

    update: async (req, res) => {
        console.log(req.body)

        try{
            
            const automatisation_sanction = await AutomatisationSanction.findById(req.params.id)
            await automatisation_sanction.updateOne({...req.body})

            await automatisation_sanction.populate('motif')
            console.log('automatisation sanction',automatisation_sanction)
            return res.status(201).json(automatisation_sanction);

        }catch(err){
            console.error(err)
            es.status(500).json({error: 'Erreur lors de la creation de l\' automatisation'})
        }
    },
}

module.exports = automatisationSanctionController