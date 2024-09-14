const Transaction = require("../models/transaction")


const transactionRepositorie = {
    bilan: (trans) =>{
        const bilan = []
        if(trans){
            const entrees = (trans.filter(elt => elt.type === 'input' && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const sorties = (trans.filter(elt => elt.type === 'output' && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const diff = entrees - sorties

            const p_sanctions = (trans.filter(elt =>  elt.reference.includes('Sanction') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_tontine = (trans.filter(elt =>  elt.reference.includes('participation_trans_montant_tontine') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_plat = (trans.filter(elt =>  elt.reference.includes('participation_trans_montant_plat') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_social = (trans.filter(elt =>  elt.reference.includes('participation_trans_montant_prelevement_social') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_receptoniste = (trans.filter(elt =>  elt.reference.includes('seance_trans_montant_receptioniste') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_beneficiaire = (trans.filter(elt =>  elt.reference.includes('seance_trans_montant_beneficiaire') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_enchere = (trans.filter(elt =>  elt.reference.includes('seance_trans_montant_enchere') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);
            const p_fond_caisse = (trans.filter(elt =>  elt.reference.includes('inscription_trans_fond_caisse') && elt.montant).map(elt => elt.montant)).reduce((accumulator, currentValue) => {    return accumulator + currentValue; }, 0);

            bilan.push({label:'Paiement des sanctions', value:p_sanctions, ref:'Sanction', type: 'input', order: 1})
            bilan.push({label:'Contributions au Plat', value:p_plat, ref:'participation_trans_montant_plat', type: 'input', order: 2})
            bilan.push({label:'Prélèvements Sociaux', value:p_social, ref:'participation_trans_montant_prelevement_social', type: 'input', order: 3})
            bilan.push({label:'Tontines', value:p_tontine, ref:'participation_trans_montant_tontine', type: 'input', order: 4})
            bilan.push({label:'Décaissement aux Réceptionnistes', value:p_receptoniste, ref:'seance_trans_montant_receptioniste', type: 'output', order: 5})
            bilan.push({label:'Décaissement aux Bouffeurs', value:p_beneficiaire, ref:'seance_trans_montant_beneficiaire', type: 'output', order: 6})
            bilan.push({label:'Totals des enchères', value:p_enchere, ref:'seance_trans_montant_enchere', type: 'input', order: 7})
            bilan.push({label:'Totals fond de caisse', value:p_fond_caisse, ref:'inscription_trans_fond_caisse', type: 'input', order: 8})
            bilan.push({label:'Total Des Entréess', value:entrees, ref:undefined, type: 'input', order: 9})
            bilan.push({label:'Total Des Sorties:', value:sorties, ref:undefined, type: 'output', order: 10})
            bilan.push({label:'Différence', value:diff, ref:undefined, type: diff > 0? 'input':'output', order: 11})
        }

        return bilan
    }
}

module.exports = transactionRepositorie
