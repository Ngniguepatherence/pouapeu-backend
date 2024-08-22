const Transaction = require("../models/transaction");
const transactionRepositorie = require("../repositories/transsaction");

const transactionController = {
    getAll: async (req, res) => {
        Transaction.find()
        .exec().then(trans => {
            const bilan = transactionRepositorie.bilan(trans)
            res.json({
                bilan: bilan,
                transactions: trans
            });
        }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
    },

    getAllBySaison: async (req, res) => {
        Transaction.find({saison : req.params.saison_id})
        .exec().then(trans => {
            const bilan = transactionRepositorie.bilan(trans)
            res.json({
                bilan: bilan,
                transactions: trans
            });
        }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
    },

    get: async (req, res) => {
        Transaction.findById(req.params.id)
        .exec().then(trans => {
            res.json(trans);
        }).catch(err=>{
            console.error(err)
            res.status(500).json({message: "Internal Server Error" });
          })
    },
}

module.exports = transactionController