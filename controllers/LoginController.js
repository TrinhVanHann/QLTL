require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const Folder = require('../models/Folders')
const { createFolder } = require('../models/Upload.model')
const bcrypt = require('bcrypt')

class LoginController{
    index(req, res, next){
        res.render('login')
    }

    async auth(req, res, next){
        const { username, password } = req.body;
        const secretKey = process.env.SECRET_KEY

        const user = await User.findOne({ username });
        if (user && password === user.password) {
            Folder.findOne({ name: username })
            .then((folder) => {
                const token = jwt.sign( 
                    {
                        user_id: user._id,
                        root_id: folder._id
                    },
                    secretKey,
                    { expiresIn: "2h" }
                )
                
                res.json({
                    token: token
                })
            })
        }
        else {
            res.status(401).json({ message: 'Đăng nhập không thành công' });
        }
    }

}
module.exports = new LoginController