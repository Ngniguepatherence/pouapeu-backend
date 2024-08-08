const Saison = require("../models/saison")

 const saisonRepositorie = {
    get_nbr_max_nom_decaissable: async (saison_id) => {

        const saison = await Saison.findById(saison_id)

        return saison.total_cotise_tontine / saison.montant_un_nom
    }

    
}

module.exports = saisonRepositorie