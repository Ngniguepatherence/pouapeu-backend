const Inscription = require("../models/inscription_saison")

 const inscriptionSaisonRepositories = {
    addInscriptionSaison : async (inscriptionData, saison) => {
        /**
         * @param inscriptionData: req body
         * @param saison saison without population
         */

        
        const inscription = new Inscription({...inscriptionData, saison: saison._id})
        if(saison.fond_caisse_minimal <= inscriptionData.fond_caisse ){
            await inscription.save()
            await saison.populate({
                path:'participants',
            })
            saison.participants.push(inscription)
            await saison.save()
            return saison
        }else{
            return false
        }
        

        

    }
}

module.exports = inscriptionSaisonRepositories