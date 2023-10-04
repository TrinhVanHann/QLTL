require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const Folder = require('../models/Folders')
const { createFolder } = require('../models/Upload.model')
const bcrypt = require('bcrypt')

class RegisterController{
    index(req, res, next) {
        res.render('Login/register')
    }
    async auth(req, res, next){
        const { username, password } = req.body;
        const secretKey = process.env.SECRET_KEY

        const user = await User.findOne({ username });
        if(!user){
            let rootId;
            const newUser = await new User({
                username: username,
                password: password
            })

            createFolder(username)
                .then((folderId) => {
                    rootId = folderId
                    const newFolder = new Folder({
                        id: folderId,
                        name: username,
                    })
                    return newFolder
                })
                .then((newFolder) => {
                    newUser.folder_id = newFolder._id
                    return newFolder
                })
                .then((newFolder) => {
                    newUser.save()
                    newFolder.save()

                    const token = jwt.sign(
                        { 
                            user_id: newUser._id,
                            root_id: rootId
                        },
                        secretKey,
                        { expiresIn: "24h" }
                    )
                    
                    return res.json({
                        token: token
                    })
                })
                .catch((err) => {
                    console.error(err)
                })  
        }else {
            res.status(401).json({ message: 'Tài khoản đã tồn tại' });
        }
    }
}
module.exports = new RegisterController