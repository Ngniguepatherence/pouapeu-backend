const ParticipationSeance = require('../models/participation_sceance');
const Profile = require('../models/profil');
const Sanctions = require('../models/sanctions');
const Seance = require('../models/seance');
const { participationRepositorie } = require('../repositories/participation');
const { seanceRepositories } = require('../repositories/seance_repositore');

const SeanceController = {
    addSeance: async (req, res) => {
        try {
            const { date, type_seance, nbre_pers_tontinard, nbre_pers_non_tontinard,effectif, beneficaire} = req.body;

            var seance = new Seance(req.body);
            await seance.save();

            const participations = []

            await seance.populate({
                path: 'saison',
                populate: 'participants'
            })
            const membres = seance.saison.participants
            console.log('membres',membres)
            for(const membre of membres){
                const  p = new ParticipationSeance({
                    inscrit: membre._id,
                    presence: false,
                    retardataire: false,
                    montant_plat:0,
                    montant_tontine: 0,
                    montant_prelevement_social: membre.nombre_de_noms==0 ? 0 : seance.saison.montant_contribution_social,
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
                {
                    path: 'beneficaire_tontine',
                    populate:{
                        path: 'membre'
                    }
                },
                {
                    path: 'beneficaire_plat',
                    populate:{
                        path: 'membre'
                    }
                },
                'saison',
                {
                    path: 'participations',
                    populate:{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
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

    updateSeance: async (req, res) => {

        try {
            const seance = await Seance.findById(req.params.id)
            await seance.updateOne({...req.body})

            await seance.populate([
                {
                    path: 'beneficaire_tontine',
                    populate:{
                        path: 'membre'
                    }
                },
                {
                    path: 'beneficaire_plat',
                    populate:{
                        path: 'membre'
                    }
                },
                'saison',
                {
                    path: 'participations',
                    populate:{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
                    }
                },
                {
                    path: 'sanctions',
                    populate:['motif','inscrit']
                }
            ])
        
            console.log(seance)
            res.json(seance);
            
        }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
        }


    },


    getALL: async (req, res) => {
        Seance.find()
        .populate([
            {
                path: 'beneficaire_tontine',
                populate:{
                    path: 'membre'
                }
            },
            {
                path: 'beneficaire_plat',
                populate:{
                    path: 'membre'
                }
            },])
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
                {
                    path: 'beneficaire_tontine',
                    populate:{
                        path: 'membre'
                    }
                },
                {
                    path: 'beneficaire_plat',
                    populate:{
                        path: 'membre'
                    }
                },
                'saison',
                {
                    path: 'participations',
                    populate:{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
                    }
                },
                {
                    path: 'sanctions',
                    populate:['motif',{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
                    }]
                }
            ])
        
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

    saveParticipations: async (req, res) => {
        console.log(req.body)
        const {participations, montant_receptioniste, montant_beneficiaire} = req.body
        try {
            const seance = await Seance.findById(req.params.id)
            await seance.populate([
                {
                    path: 'beneficaire_tontine',
                    populate:{
                        path: 'membre'
                    }
                },
                {
                    path: 'beneficaire_plat',
                    populate:{
                        path: 'membre'
                    }
                },
                {
                    path: 'participations',
                    populate:{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
                    }
                },
                {
                    path: 'sanctions',
                    populate:['motif','inscrit']
                }]
            )

            var effectif =0
            for( const p of participations){{
                await ParticipationSeance.updateOne({
                    _id: p._id,
                },{...p})
                if(p.presence)
                    effectif += 1
            }}

            await seance.updateOne({
                effectif: effectif,
                montant_receptioniste: montant_receptioniste,
                montant_beneficiaire: montant_beneficiaire,
            })

            await participationRepositorie.ApplyAutoSanction(seance._id)

            await seanceRepositories.calsulateSeanceSummary(seance._id)
        
            
            
            
            const newSeance = await Seance.findById(req.params.id)
            await newSeance.populate([
                {
                    path: 'beneficaire_tontine',
                    populate:{
                        path: 'membre'
                    }
                },
                {
                    path: 'beneficaire_plat',
                    populate:{
                        path: 'membre'
                    }
                },
                'saison',
                {
                    path: 'participations',
                    populate:{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
                    }
                },
                {
                    path: 'sanctions',
                    populate:['motif','inscrit']
                }
            ])
            // console.log(newSeance)
            res.json(newSeance);
            
          }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          }
    },

    addSanction: async (req, res) => {
        console.log(req.body)
        try {
            const seance = await Seance.findById(req.params.id)
            await seance.populate('sanctions')

            const sanction = new Sanctions({...req.body})
            await sanction.save()

            seance.sanctions.push(sanction)
            await seance.save()

            await seanceRepositories.calsulateSeanceSummary(seance._id)
            console.log(sanction)
            res.json(sanction);
            
          }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          }
    },
}

module.exports = SeanceController;