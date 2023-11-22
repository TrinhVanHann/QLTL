require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const Folder = require('../models/Folders')
const { createFolder } = require('../models/Upload.model')
const bcrypt = require('bcrypt')

class RegisterController {
    //GET /register
    index(req, res, next) {
        res.render('Login/register')
    }

    //POST /register
    async auth(req, res, next) {
        const { username, password, department, role } = req.body;
        const secretKey = process.env.SECRET_KEY

        const user = await User.findOne({ username: username });
        if (!user) {
            try {
                const folderId = await createFolder(username)

                const newFolder = new Folder({
                    _id: folderId,
                    name: username,
                    owner: username,
                })
                await newFolder.save()

                const newUser = new User({
                    username: username,
                    password: password,
                    department: department,
                    role: role,
                    folder_id: newFolder._id
                })
                await newUser.save()

                const token = await jwt.sign(
                    {
                        user_id: newUser._id,
                        username: newUser.username,
                        root_id: newUser.folder_id
                    },
                    secretKey,
                    { expiresIn: "24h" }
                )

                return res.json({
                    token: token
                })
            }
            catch (err) {
                console.error(err)
            }
        } else {
            res.status(401).json({ message: 'Tài khoản đã tồn tại' });
        }
    }
}
module.exports = new RegisterController
