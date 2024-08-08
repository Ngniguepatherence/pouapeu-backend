const AutomatisationSanction = require("../models/automatisation_sanction")
const Sanctions = require("../models/sanctions")
const seanceRepositories = require("./seance_repositore")

 const participationRepositorie = {
    getAutoSanctionMotif: async (code, sanction, inscrit_id) => {
        try{
            const auth = await AutomatisationSanction.findOne({code: code})
            if(auth && auth.actif){
                const motif_to_check =  auth.motif
                for( const elt of sanction){
                    if(elt.motif._id === motif_to_check._id && elt.inscrit._id === inscrit_id )
                        return false
                }
                return motif_to_check
            }

            return false
            

        }catch(err){
            console.error(error)
        }
    },

    ApplyAutoSanction: async (seance_id) => {
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
                },
                {
                    path: 'sanctions',
                    populate: [
                        "motif",{
                        path: 'inscrit',
                        populate:{
                            path: 'membre'
                        }
                    }]
                }]
            )

            for(const p of seance.participations){
                if(!p.presence ){
                    // absence
                    const motif = await getAutoSanctionMotif("ABSC",seance.sanctions, p.inscrit._id)
                    if(motif){
                        const sanction = new Sanctions({
                            motif: motif._id,
                            inscrit: p.inscrit._id,
                            date: new Date(),
                            saison: seance.saison._id
                        })
                        await sanction.save()

                        seance.sanctions.push(sanction)

                    }

                    
                }

                if(p.retardataire ){
                    // RETARD 
                    const motif = await getAutoSanctionMotif("RTRD",seance.sanctions, p.inscrit._id)
                    if(motif){
                        const sanction = new Sanctions({
                            motif: motif._id,
                            inscrit: p.inscrit._id,
                            date: new Date(),
                            saison: seance.saison._id
                        })
                        await sanction.save()

                        seance.sanctions.push(sanction)

                    }
                }

                if(p.montant_plat <= 0 ){
                    // Echec contribution au plat
                    const motif = await getAutoSanctionMotif("ECPT",seance.sanctions, p.inscrit._id)
                    if(motif){
                        const sanction = new Sanctions({
                            motif: motif._id,
                            inscrit: p.inscrit._id,
                            date: new Date(),
                            saison: seance.saison._id
                        })
                        await sanction.save()

                        seance.sanctions.push(sanction)

                    }

                }

                if(p.montant_prelevement_social <= 0 ){
                    // Echec contribution social
                    const motif = await getAutoSanctionMotif("ECSL",seance.sanctions, p.inscrit._id)
                    if(motif){
                        const sanction = new Sanctions({
                            motif: motif._id,
                            inscrit: p.inscrit._id,
                            date: new Date(),
                            saison: seance.saison._id
                        })
                        await sanction.save()

                        seance.sanctions.push(sanction)

                    }
                    
                }

                if(seanceRepositories.computInscriEchecTontine(p.inscrit.nombre_de_noms, seance.saison.montant_un_nom, p.montant_tontine) > 0 
                        && p.inscrit.nombre_de_bouf  === 0
                    ){
                    // Echec Tontine simple
                    const motif = await getAutoSanctionMotif("ETSP",seance.sanctions, p.inscrit._id) 
                    if(motif){
                        const sanction = new Sanctions({
                            motif: motif._id,
                            inscrit: p.inscrit._id,
                            date: new Date(),
                            saison: seance.saison._id
                        })
                        await sanction.save()

                        seance.sanctions.push(sanction)

                    }

                }

                if(seanceRepositories.computInscriEchecTontine(p.inscrit.nombre_de_noms, seance.saison.montant_un_nom, p.montant_tontine) > 0 
                        && p.inscrit.nombre_de_bouf  > 0
                    ){
                    // Echec Tontine ayant bouffé
                    const motif = await getAutoSanctionMotif("ETAB",seance.sanctions, p.inscrit._id)
                    if(motif){
                        const sanction = new Sanctions({
                            motif: motif._id,
                            inscrit: p.inscrit._id,
                            date: new Date(),
                            saison: seance.saison._id
                        })
                        await sanction.save()

                        seance.sanctions.push(sanction)

                    }
                }

                
            }

            await seance.save()
        }catch(err){
            console.error(err)
        }
    }
}

module.exports = participationRepositorie