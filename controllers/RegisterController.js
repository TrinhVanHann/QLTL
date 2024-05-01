require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const bcrypt = require('bcrypt')

class RegisterController {
    //GET /register

    //POST /register
    async auth(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const secretKey = process.env.SECRET_KEY

            const user = await User.findOne({ username: username });
            if (!user) {
                const newUser = new User({
                    username: username,
                    email: email,
                    password: await bcrypt.hash(password, 10)
                })
                await newUser.save()

                const token = jwt.sign(
                    {
                        user_id: newUser._id,
                        username: newUser.username,
                        root_id: newUser.folder_id
                    },
                    secretKey,
                    { expiresIn: "24h" }
                )

                res.send({
                    msg: 'success',
                    token: token
                })
            } else {
                res.status(401).json({ msg: 'failure' });
            }

        } catch (err) {
            console.error(err)
        }
    }
}
module.exports = new RegisterController
