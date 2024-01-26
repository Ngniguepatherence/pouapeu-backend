const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');
// const {upload} = require('../models/storage');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
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

router.get('/',projetController.getProjet);
router.get('/:id',projetController.getProjetId);
router.post('/',projetController.addProjet);
// upload image
router.post('/uploadImage', upload.array("files", 10),projetController.uploadImage);
router.post('/delete/:id',projetController.deleteProjet);
module.exports = router;