const Seance = require("../models/seance")

 const seanceRepositories = {
    computInscriEchecTontine : (nbr_nom, montant_un_nom, montant_tontine) => {
        const nbr_nom_tontine = montant_tontine / montant_un_nom
        console.log(montant_tontine," / ",montant_un_nom," = ",nbr_nom_tontine)
        return Math.round( nbr_nom - nbr_nom_tontine)
    },

     calsulateSeanceSummary : async (seance_id) => {
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
    
                newSeance.cs_total += p.montant_prelevement_social
                if(p.montant_prelevement_social <= 0)
                    newSeance.echec_cs ++;
            
            }
    
            newSeance.solde_contribution_plat = seance.recette_total_plat - seance.montant_receptioniste
            await seance.updateOne({...newSeance})
        }catch(err){
            console.error(err)
        }
    }
}

module.exports = seanceRepositories

