const User = require('../models/user');
const jwt = require('jsonwebtoken');

const secret = "je vous en prie";
const userController = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch(error) {
            res.status(500).json({message: "Internal Server Error" });
        }
    },
    // get a particular user
    getUserById: async (req, res) => {

        try {
            const { id } = req.params;
            const user = await User.findById(id);
            res.json(user);
        } catch(error) {
            res.status(500).json({message: "Internal Server Error" });
        } 
        
    },

    getUser: async (req, res) => {
          
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({error: 'Invalid Username or password'});
        }
        if (password != user.password) {
            return res.status(401).json({error: 'Invalid Username or password'});
        }
        const token = jwt.sign({userId: user}, secret, {expiresIn: '1h'});
        console.log(token);
        res.status(200).json({token, expiresIn: 3600});
            
            
    },

    addUser: async (req, res) => {
        try {
            const {names,surname, email, phone,profession, password, role} = req.body;
            if (password.length <8) {
                return res.status(400).json({message: "password less than 8 characters"});
            }
            try {
                const newUser = new User({
                    names,
                    surname,
                    email,
                    phone,
                    profession,
                    password,
                    role
                });
                await newUser.save();
                res.status(200).json({
                    message: "user successful created",
                    newUser,
                    });
                    
            } catch (err) {
                res.status(401).json({
                    message: "User not successful created",
                    error: err.message,
                })
            }
        }
        catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const {id} = req.params;
            await User.findByIdAndDelete(id);
            res.json({success: true});
        } catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        } 
    
    }
} 

module.exports = userController;