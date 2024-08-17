
 const automatisationSanctionRepositorie = {
    get_automatisations_possible:  () => {
        return [
            {
                code: "ETAB",
                label: "Echec Tontine ayant bouffé"
            },
            {
                code:"ETSP",
                label: "Echec Tontine simple"
            },
            {
                code:"ECSL",
                label: "Echec contribution social"
            },
            {
                code:"ECPT",
                label: "Echec contribution au plat"
            },
            {
                code:"RTRD",
                label: "retard"
            },
            {
                code:"ABSC",
                label: "absence séance"
            },
        ]
    }
}

module.exports = automatisationSanctionRepositorie