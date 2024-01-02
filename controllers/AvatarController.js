const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgs/avatar');
    },
    filename: function (req, file, cb) {
        const username = req.data.username;
        //const ext = path.extname(file.originalname);
        cb(null, username);
    }
});

const upload = multer({ storage: storage });

class AvatarController {
    async saveAvatar(req, res, next) {
        const username = req.data.username;
        //const ext = path.extname(req.file.originalname);
        const avatarPath = `/public/imgs/avatar/${username}`;
        await User.findOneAndUpdate({ _id: username }, { avatar: avatarPath });
        res.json({ message: 'Upload success' });
        res.redirect('back');
    }
    uploadAvatar(req, res, next) {
        upload.single('avatar')(req, res, err => {
            if (err) {
                // handle error
            } else {
                this.saveAvatar(req, res, next);
            }
        });
    }
    
}

module.exports = new AvatarController;

