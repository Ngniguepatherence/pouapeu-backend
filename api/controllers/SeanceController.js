const ParticipationSeance = require('../models/participation_sceance');
const Profile = require('../models/profil');
const Sanctions = require('../models/sanctions');
const Seance = require('../models/seance');

const computInscriEchecTontine = (nbr_nom, montant_un_nom, montant_tontine) => {
    const nbr_nom_tontine = montant_tontine / montant_un_nom
    return nbr_nom - nbr_nom_tontine
}
const calsulateSeanceSummary = async (seance_id) => {
    try {
        const seance = await Seance.findById(seance_id)
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

        const newSeance = {
            recette_total_plat:0,
            echec_plat: 0,
            solde_contribution_plat:0,

            recette_total_tontine:0,
            echec_tontine:0,

            cs_total:0,
            echec_cs:0,
            solde_cs: 0
        }

        for(const p of seance.participations){
            newSeance.recette_total_tontine += p.montant_tontine - Number(p.montant_prelevement_social)
            newSeance.echec_tontine += computInscriEchecTontine(p.inscrit.nombre_de_noms, seance.saison.montant_un_nom, p.montant_tontine);

            newSeance.recette_total_plat += p.montant_plat
            if(p.montant_plat <= 0)
                newSeance.echec_plat ++;

            newSeance.cs_total += Number(p.montant_prelevement_social)
            if(Number(p.montant_prelevement_social) <= 0)
                newSeance.echec_cs ++;
        
        }

        newSeance.solde_contribution_plat = seance.recette_total_plat - seance.montant_receptioniste
        await seance.updateOne({...newSeance})
    }catch(err){
        console.error(err)
    }
}


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

            await calsulateSeanceSummary(seance._id)
        
            
            
            
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

            await calsulateSeanceSummary(seance._id)
            console.log(sanction)
            res.json(sanction);
            
          }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          }
    },
}

module.exports = SeanceController;