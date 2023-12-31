const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgs/avatar');
    },
    filename: function (req, file, cb) {
        const userId = req.data.user_id;
        const ext = path.extname(file.originalname);
        cb(null, userId + ext);
    }
});

const upload = multer({ storage: storage });

class AvatarController {
    async saveAvatar(req, res, next) {
        const user = await User.findOne({ _id: req.data.user_id });
        const avatarPath = `/public/imgs/avatar/${req.data.user_id}`;
        await User.findOneAndUpdate({ _id: req.data.user_id }, { avatar: avatarPath });
        res.json({ message: 'Upload success' });
    }
}

module.exports = new AvatarController;
