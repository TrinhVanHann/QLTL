module.exports = function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) return res.status(401).json({ message: 'Token không được cung cấp' });
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
  
      req.user = user;
      next();
    });
}