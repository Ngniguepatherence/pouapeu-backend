const profil = require('../models/profil');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// const bcrypt= require('bcrypt');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const secret = "je vous en prie";

// bcrypt 

const profilController = {
    uploadImage : asyncHandler(async (req, res) => {
        try {
            if (req?.files?.length) {
                console.log(req.files);
                let uploadedFiles = req?.files?.map((image) => {
                    return { img: image.filename };
                });
                res.status(200).send({
                    success: true,
                    messsage: "Files Uploaded",
                    data: uploadedFiles,
                });
            } else {
                console.log("Something is missing.");
                res.status(400).send({ success: false, messsage: "Send Files." });
            }
        } catch (err) {
            console.log("error", err);
            res.status(503).send({ success: false, messsage: "Server Error." });
        }
    }),
    getProfils: async (req,res) => {
        try{
            const Profil = await profil.find();
            res.json(Profil);
        }catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },

    getProfil: async (req,res) => {
        try {
            const { email, password } = req.body;
            const Profil = await profil.findOne({email});
            if(!Profil) {
                return res.status(404).json({message: "Profil not found"});
            }
            if (password != Profil.password) {
                return res.status(401).json({error: 'Invalid Username or password'});
            }
            const token = jwt.sign({userId: Profil}, secret, {expiresIn: '1h'});
            console.log(token);
            res.status(200).json({token, expiresIn: 3600});
        }catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },


    addProfil: async (req,res) => {
       
    const {avatar, name,surname,email, phone,country,region,ville,rue,role,profession,password} = req.body;
    // hash the password with bcrypt

    
        const newProfil = new profil({
            address: {
                city: ville,
                country: country,
                state: region,
                street: rue
            },
            avatar: avatar,
            email: email,
            name: name,
            surname: surname,
            profession: profession,
            phone: phone,
            role: password,
            password: role
        });
        console.log(newProfil);
            await newProfil.save();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port:587,
                secure: true,
                auth: {
                    user: 'ngniguepafaha@gmail.com',
                    pass:'epcp ltmc rfzc khsj',
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const mailOptions = {
                from: {
                    name: 'Pouapeu Association',
                    address: 'ngniguepafaha@gmail.com',
                },
                to: email,
                subject: 'Pouapeu Account',
                text: `Bienvenu sur dans l\'association pouapeu ${name} ${surname}. Votre Compte viens d'etre active et vous pouvez retrouvez vos elements de connexion ci dessous:  username: ${email} password: ${password}Thank you. Veuillez changer ce mot de passe a votre premiere connexion pour des mesures de securite`,
              };
            transporter.sendMail(mailOptions, function(err, info){
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            res.status(200).json({
                message: "Profile successful created",
                newProfil,
                });
            
            
        
    },
    // 
    // Reset password
    resetPassword: async (req,res) => {
        try {
            const {id} = req.params;
            const password = req.body.password;
            const updateProfil = await profil.findByIdAndUpdate(id, req.body, {new: true});
            res.json({
                message: "Profile successful updated",
                updateProfil,
            });
        }
        catch(error) {
            res.status(500).json({message: "Internal Server Error during update"});
        } 
    
    },
    // update of profil
    updateProfil: async (req,res) => {
        try {
            // recupere les infos et mets les a jour
            const {id} = req.params;
            const updateProfil = await profil.findByIdAndUpdate(id, req.body, {new: true});
            res.json({
                message: "Profile successful updated",
                updateProfil,
            });
        }
        catch(error) {
            res.status(500).json({message: "Internal Server Error during update"});
        }
    },

    // delete profiler
    deleteProfil: async (req,res) => {
        try {
            const {id} = req.params;
            await profil.findByIdAndDelete(id);
            res.json({success: true});
        } catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        } 
    
    }
}

module.exports = profilController;