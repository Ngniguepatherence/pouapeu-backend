const ParticipationSeance = require('../models/participation_sceance');
const Profile = require('../models/profil');
const Seance = require('../models/seance');


const SeanceController = {
    addSeance: async (req, res) => {
        try {
            const { date, type_seance, nbre_pers_tontinard, nbre_pers_non_tontinard,effectif, beneficaire} = req.body;

            const seance = new Seance(req.body);
            await seance.save();

            const participations = []

            const membres = await Profile.find()
            console.log('membres',membres)
            for(const membre of membres){
                const  p = new ParticipationSeance({
                    membre: membre._id,
                    presence: false,
                    retardataire: false,
                    montant_plat:0,
                    montant_tontine: 0,
                    montant_contribution_social: 0,
                    seance: seance._id,
                })

                await p.save()
                console.log('ps',p)
                participations.push( p._id )
            }

            console.log('participations',participations)
            await seance.updateOne({
                participations: participations
            })

            seance = await Seance.findById(seance._id)
            
            await seance.populate([
                'beneficaire_tontine',
                'beneficaire_plat',
                {
                    path: 'participations',
                    populate:{
                        path: 'membre'
                    }
                }]
            )

            console.log('seance',seance)
            return res.status(201).json(seance);
        }
        catch (error) {
            console.error(error)
            res.status(500).json({error: 'Erreur lors de la creation de la seance'})
        }
    },


    getALL: async (req, res) => {
        Seance.find()
        .populate('beneficaire_tontine' , 'beneficaire_plat')
        .exec().then(seances=> {
              res.json(seances);
            
          }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
        // try {
        //     const seances = await Seance.find();
            
        //     res.json(seances);
        // } catch(error) {
        //     res.status(500).json({message: "Internal Server Error" });
        // }
    
    },

    getOne: async (req, res) => {
        try {
            const seance = await Seance.findById(req.params.id)
            await seance.populate([
                'beneficaire_tontine',
                'beneficaire_plat',
                {
                    path: 'participations',
                    populate:{
                        path: 'membre'
                    }
                }]
            )
        
            console.log(seance)
              res.json(seance);
            
          }catch(err){
            console.error(err)
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

    saveParticipation: async (req, res) => {
        
    }
}

module.exports = SeanceController;