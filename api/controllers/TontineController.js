const Tontine = require('../models/tontine');

const tontineController = {
    getAll: async (req, res) => {
        Tontine.find()
        .populate('seance')
        .exec().then(tontines => {
            res.json(tontines);
        }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
        // try {
        //     const tontines = await Tontine.find();
        //     res.json(tontines);
        // } catch (error) {
        //     res.status(500).json({ message: error.message });
        // }
    },
    addTontine: async (req, res) => {
        const { membre, typeCotisation,montant,beneficiare, date,seance} = req.body;
        // console.log(membre, typeCotisation, montant, beneficiare, date);
        let newMontant = parseInt(montant);
        
        try {
            if(newMontant != 0) {

                const newTontine = new Tontine({ membre,type_cotisation:typeCotisation,Montant:montant,Beneficiaire:beneficiare, date, seance, status:'payer' });
                await newTontine.save();
                res.status(201).json(newTontine);
            }
            else {
                const newTontine = new Tontine({ membre, typeCotisation,Montant:montant,beneficiare, date, seance, status:'non-payer' });
                await newTontine.save();
                res.status(201).json(newTontine);
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


}

module.exports = tontineController;