const profil = require('../models/profil');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// const bcrypt= require('bcrypt');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
const secret = "je vous en prie";
const gpc = require('generate-pincode');
let pin='';
// bcrypt 

function generatePin() {
    const pinOptions = {
        length: 6, // Longueur du code PIN
        type: 'numeric', // Type de caractères du code PIN
      };
    pin = gpc(6);
  }

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
            res.json(Profil.reverse());
        }catch(error) {
            res.status(500).json({message: "Internal Server Error"});
        }
    },
    getId: async(req,res) => {
        const {id} = req.params;
        try {

            const Profil = await profil.findById(id);
            if(!profil) {
                return res.status(404).json({message: "Profil not found"});
            }
            res.json(Profil);
        }catch {
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
       
    const {avatar, name,surname,email, phone,country,ville,role,profession,password} = req.body;
    // hash the password with bcrypt
    const existingUser = await profil.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }
    
        const newProfil = new profil({
            address: {
                city: ville,
                country: country,
            },
            avatar: avatar,
            email: email,
            name: name,
            surname: surname,
            profession: profession,
            phone: phone,
            role: role,
            password: password
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
                text: `Bienvenu sur dans l\'association pouapeu <b> ${name} ${surname} </b>. Votre Compte viens d'étre activé et vous pouvez rétrouvez vos élements de connexion ci dessous:\n Nom Utilisateur: ${email} \n Mot de Passe: ${password} \nThank you. \n\nVeuillez changer ce mot de passe a votre premiere connexion pour des mesures de securite \n\nThank you. For Technical Support or any business inquiry, you can reach out to us at contact@pouapou.com`,
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

    forgotPassword: async (req,res) => {
        try {
            const {email} = req.body;
            if(!email) {
                return res.status(400).json({error: 'Email is required'});
            }
            const user = profil.findOne({email});
            if(!user){
                return res.status(404).json({error: 'User not found'});
            }
            // let encrypted = cipher.update(user._id, 'utf8', 'hex');
            // encrypted += cipher.final('hex');
            generatePin();
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
                subject: 'Reset Password',
                text: `This is your pin code that you will use to reset your password account. \n Code Pin: ${pin}  \nThank you. `,
              };
            transporter.sendMail(mailOptions, function(err, info){
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            res.status(200).json({
                message: "Un email vous a été envoyé"
                            });

        } catch(error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            res.status(500).json({error: "Erreur lors de la réinitialisation du mot de passe"});
        }
    },

    Verification: async (req,res) => {
        try {
            const {codepin} = req.body;
            
            console.log(codepin,pin);
            if(codepin === pin) {
                res.status(201).json({message: "code correct"});
            }
        }
        catch(error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            res.status(500).json({error: "ECode Pin Incorrect"});
        }
    },
    // 
    // Reset password
    resetPassword: async (req,res) => {
        try {
            const {id} = req.params;
            // const decipher = crypto.createDecipheriv(algorithm, key, iv);

            // let decryptedId = decipher.update(id, 'hex', 'utf8');
            // decryptedId += decipher.final('utf8');

            const password = req.body.password;
            const user =   await profil.findById(id);
            if(!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            user.password = password;
            await user.save();
            res.json({ message: 'Mot de passe mis à jour avec succès!' });
        }
        catch(error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            res.status(500).json({error: "Erreur lors de la réinitialisation du mot de passe"});
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