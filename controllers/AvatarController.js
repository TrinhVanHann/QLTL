const User = require('../models/Users')
//save the avatar to the database
class AvatarController {
    async saveAvatar(req, res, next) {
        const user = await User.findOne({ _id: req.data.user_id })
        user.avatar = req.file.buffer
        await user.save()
        .then(() => {
            res.json({message : 'Upload success'})
        })
        
        .then(() => {
            res.redirect('back')
        })
    }
}
module.exports = new AvatarController