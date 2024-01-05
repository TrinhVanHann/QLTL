require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const Folder = require('../models/Folders')
const { createFolder } = require('../models/Upload.model')
const bcrypt = require('bcrypt')

class LoginController {
    // GET /login
    index(req, res, next) {
        res.render('Login/login')
    }

    // POST /login/auth
    async auth(req, res, next) {
        const { username, password, role } = req.body;
        const secretKey = process.env.SECRET_KEY

        const user = await User.findOne({ username });
        if (user) {
            // const isPasswordValid = await bcrypt.compare(password, user.password)
            const isPasswordValid = user.password === password
            if (isPasswordValid && role === user.role) {
                Folder.findOne({ _id: user.folder_id })
                    .then((folder) => {
                        const token = jwt.sign(
                            {
                                user_id: user._id,
                                username: user.username,
                                root_id: folder._id
                            },
                            secretKey,
                            { expiresIn: "2h" }
                        )
                        return res.json({
                            token: token
                        })
                    })
            }
            else {
                res.status(401).send({ message: 'Đăng nhập không thành công' });
            }
        }
        else {
            res.status(401).send({ message: 'Đăng nhập không thành công' });
        }
    }

    //GET /login/change
    change(req, res, next) {
        res.render('Login/changePassword')
    }

    //POST /login/change
    updateChange(req, res, next) {
        const { username, oldPassword, newPassword } = req.body;
        User.findOne({ username: username })
            .then((user) => {
                if (user && user.password === oldPassword) {
                    user.password = newPassword
                    user.save()
                }
                else {
                    res.status(401).send({ message: 'Tên đăng nhập hoặc mật khẩu của bạn không đúng' });
                }
            })
            .then(() => {
                res.redirect('/')
            })
            .catch(next)
    }
}
module.exports = new LoginController 