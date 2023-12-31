const express = require('express');
const router = express.Router();
const multer = require('multer');
const AvatarController = require('../controllers/AvatarController');
const uploadAvatar = multer({
    limits: { fileSize: 1024 * 1024 * 100 },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(null, true);
    }
});

router.post('/avatar', uploadAvatar.single('avatar'), AvatarController.saveAvatar);

module.exports = router;
