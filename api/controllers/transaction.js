const Transaction = require("../models/transaction");

const transactionController = {
    getAll: async (req, res) => {
        Transaction.find()
        .exec().then(trans => {
            res.json(trans);
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
    }
}

module.exports = transactionController