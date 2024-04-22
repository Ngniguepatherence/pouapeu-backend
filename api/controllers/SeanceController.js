const ParticipationSeance = require('../models/participation_sceance');
const Profile = require('../models/profil');
const Seance = require('../models/seance');


const calsulateSeanceSummary = async (seance_id) => {
    try {
        const seance = await Seance.findById(seance_id)
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

        const newSeance = {
            recette_total_plat:0,
            echec_plat: 0,
            solde_contribution__plat:0,

            recette_total_tontine:0,
            echec_tontine:0,

            cs_total:0,
            echec_cs:0,
            solde_cs: 0
        }

        for(const p of seance.participations){
            newSeance.recette_total_tontine += p.montant_tontine
            if(p.montant_tontine <= 0)
                newSeance.echec_tontine ++;

            newSeance.recette_total_plat += p.montant_plat
            if(p.montant_plat <= 0)
                newSeance.echec_plat ++;

            newSeance.cs_total += Number(p.montant_prelevement_social)
            if(p.montant_prelevement_social <= 0)
                newSeance.echec_cs ++;
        
        }

        newSeance.montant_tontine -= newSeance.montant_prelevement_social

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

            const membres = await Profile.find()
            console.log('membres',membres)
            for(const membre of membres){
                const  p = new ParticipationSeance({
                    membre: membre._id,
                    presence: false,
                    retardataire: false,
                    montant_plat:0,
                    montant_tontine: 0,
                    montant_prelevement_social: 0,
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

    saveParticipations: async (req, res) => {
        console.log(req.body)
        const {participations, montant_receptioniste, montant_demi_non_decaisse} = req.body
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

            const effectif =0
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
                montant_demi_non_decaisse: montant_demi_non_decaisse,
            })

            await calsulateSeanceSummary(seance._id)
        
            
            
            
            const newSeance = await Seance.findById(req.params.id)
            await newSeance.populate([
                'beneficaire_tontine',
                'beneficaire_plat',
                {
                    path: 'participations',
                    populate:{
                        path: 'membre'
                    }
                }]
            )
            console.log(newSeance)
            res.json(newSeance);
            
          }catch(err){
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          }
    }
}

module.exports = SeanceController;