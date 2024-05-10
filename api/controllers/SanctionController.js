const MotifSanction = require("../models/motif_sanction");
const Sanctions = require("../models/sanctions");
const Seance = require("../models/seance");

const sanctionsController = {

    addSanction: async (req, res) => {
        console.log(req.body)

        try{
            var sanction = new Sanctions(req.body)
            await sanction.save();

            console.log('sanction:',sanction)
            return res.status(201).json(sanction);

        }catch(err){
            console.error(err)
            es.status(500).json({error: 'Erreur lors de la creation de la saison'})
        }
    },

    getAll: async (req, res) => [
        Sanctions.find()
        .populate(['motif', {
            path:'inscrit',
            populate: 'membre'
            }
        ])
        .exec().then(sanctions=> {
              res.json(sanctions);
            
          }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
    ],

    getOne: async(req,res) => {
        try {
            const sanction = await Sanctions.findById(req.params.id)
            await sanction.populate([
                'motif',{
                path:'inscrit',
                populate: 'membre'
            }])

            console.log(sanction)

            res.json(sanction);
        }catch(err){
            console.error(err)
            es.status(500).json({error: 'internal server error'})
        }

    },

    updateSanction: async(req,res) => {
        try {
            console.log(req.body)

            const sanction = await Sanctions.findById(req.params.id)
            await sanction.updateOne({
                ...req.body
            })

            console.log(sanction)

            res.json(sanction);
        }catch(err){
            console.error(err)
            res.status(500).json({error: 'internal server error'})
        }
    },

    addMotif: async (req, res) => {
        try{
            var motifSanction = new MotifSanction(req.body)
            await motifSanction.save();

            console.log('motif sanction:',motifSanction)
            return res.status(201).json(motifSanction);

        }catch(err){
            console.error(err)
            es.status(500).json({error: 'Erreur lors de la creation de la saison'})
        }
    },

    updateMotif: async (req, res) => {
        try{
            console.log('incoming: :',req.body)
            var motifSanction = await MotifSanction.findById(req.params.id)
            await motifSanction.updateOne({...req.body})
            console.log('motif sanction:',motifSanction)
            return res.status(201).json(motifSanction);

        }catch(err){
            console.error(err)
            res.status(500).json({error: 'Erreur lors de la creation de la saison'})
        }
    },

    getAllMotif: async (req, res) => {
        console.log("===========================================")
        MotifSanction.find()
        // .populate(['motif', 'inscrit'])
        .exec().then(sanctions=> {
              res.json(sanctions);
            
          }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
    }
}

module.exports = sanctionsController