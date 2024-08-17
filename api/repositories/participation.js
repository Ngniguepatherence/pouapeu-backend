const AutomatisationSanction = require("../models/automatisation_sanction")
const Sanctions = require("../models/sanctions")
const Seance = require("../models/seance")
const seanceRepositories = require("./seance_repositore")

 const participationRepositorie = {
    getAutoSanctionMotif: async (code, sanction, inscrit_id) => {
        console.log("in getAutoSanctionMotif")
        try{
            const auth = await AutomatisationSanction.findOne({code: code})
            console.log("Autho :", auth)
            if(auth && auth.actif){
                const motif_to_check =  auth.motif
                console.log("motif_to_check :", motif_to_check)
                // console.log("sanction :", sanction)
                console.log("inscrit_id :", inscrit_id)
                for( const elt of sanction){
                    console.log("elt :", elt)
                    console.log("elt.motif._id :", elt.motif._id)
                    console.log("motif_to_check._id :", motif_to_check._id)
                    console.log("elt.inscrit._id :", elt.inscrit._id)
                    console.log("inscrit_id :", inscrit_id)
                    if(elt.motif._id.toString() == motif_to_check._id.toString() && elt.inscrit._id.toString() == inscrit_id.toString() ){
                        console.log("Sanction existante :", sanction)
                        return false
                    }
                }
                return motif_to_check
            }

            return false
            

        }catch(err){
            console.error(error)
        }
    },

    ApplyAutoSanction: async (seance_id) => {
        console.log("in ApplyAutoSanction")
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
                    const motif = await participationRepositorie.getAutoSanctionMotif("ABSC",seance.sanctions, p.inscrit._id)
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
                    console.log("Retard detecte")
                    const motif = await participationRepositorie.getAutoSanctionMotif("RTRD",seance.sanctions, p.inscrit._id)
                    console.log(motif)
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
                    const motif = await participationRepositorie.getAutoSanctionMotif("ECPT",seance.sanctions, p.inscrit._id)
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
                    const motif = await participationRepositorie.getAutoSanctionMotif("ECSL",seance.sanctions, p.inscrit._id)
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
                    const motif = await participationRepositorie.getAutoSanctionMotif("ETSP",seance.sanctions, p.inscrit._id) 
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
                    const motif = await participationRepositorie.getAutoSanctionMotif("ETAB",seance.sanctions, p.inscrit._id)
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