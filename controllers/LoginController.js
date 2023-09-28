require('dotenv').config()
const jwt = require('jsonwebtoken')

class LoginController{
    index(req, res, next){
        res.render('login')
    }
    auth(req, res, next){
        const { username, password } = req.body;
        const secretKey = process.env.SECRET_KEY
        //Kiểm tra thông tin đăng nhập và tạo JWT nếu hợp lệ
        if (true) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            res.redirect('/')
        }
        else {
            res.status(401).json({ message: 'Đăng nhập không thành công' });
        }
    }
}
module.exports = new LoginController