const jwt = require('jsonwebtoken')

module.exports = function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login')

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Bạn không có quyền lấy thông tin trang này' })

    req.data = decoded
    next();
  });
} 