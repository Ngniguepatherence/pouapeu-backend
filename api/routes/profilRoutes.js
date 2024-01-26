const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({storage: storage});


router.get('/',profilController.getProfils);
router.get('/login',profilController.getProfil);
router.post('/',profilController.addProfil);
router.post('/uploadImage', upload.array("files", 10),profilController.uploadImage);
router.post('/reset-password',profilController.resetPassword);

module.exports = router;