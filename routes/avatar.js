const express = require('express');
const router = express.Router();
const multer = require('multer');
const AvatarController = require('../controllers/AvatarController');

router.post('/action/uploadAvatar', (req, res, next) => {
    multer({ dest: 'public/imgs/avatar' }).single('avatar')(req, res, err => {
        if (err) {
            // handle error
            next(err);
        } else {
            AvatarController.uploadAvatar(req, res, next);
        }
    });
});

module.exports = router;
