const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // Header FORMAT: Authorization: Bearer <auth_token>
  // split in order to get array of ['Bearer', '<auth_token>'] and get only token
  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }

  jwt.verify(token, 'somesecretkey', (err, authData) => {
    if (err) {
      req.isAuth = false;
      return next();
    } else {
      req.isAuth = true;
      req.userId = authData.userId;
      next();
    }
  });
};
