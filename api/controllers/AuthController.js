// const User = require('../models/user');
const profil = require('../models/profil');
const jwt = require('jsonwebtoken');

const secret = "je vous en prie";

const authControl = {
    Auth: async (req,res) => {
        const {email,password} = req.body;
        try {

            const user = await profil.findOne({email});
            if(!user) {
                return res.status(401).json({error: 'Invalid email'});
            }
            if(user.password == password) {
            const token = jwt.sign({userId: user}, secret, {expiresIn: '1h'});
            console.log(token);
            res.status(200).json({token, expiresIn: 3600});
            }
        }
        catch(error) {
            res.status(500).json({error: 'Internal ERROR'});
        }
    },
    Login: async (req,res) => {
        const { email, expires } = req.body;
        const user = await profil.findOne({email});
        if(!user) {
            return res.status(401).json({error: 'Invalid email'});
        }
        const expiration = new Date(expires).getTime();
        const currentTimestamp = new Date().getTime();
        if (currentTimestamp > expiration) {
            return res.status(401).json({error: 'Le token a expiré'});
        }
        const token = jwt.sign({userId: user}, secret, {expiresIn: '1h'});
        console.log(token);
        res.status(200).json({token, expiresIn: 3600});
    },

    Logout: async(req,res) => {
        res.status(200).json({"message": "logout sucessfully"});
    }
}

module.exports = authControl;