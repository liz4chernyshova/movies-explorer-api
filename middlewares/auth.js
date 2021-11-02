const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    next(new AuthorizationError(401));
  } else {
    const token = cookie.replace('jwt=', '');
    let payload;

    try {
      payload = jwt.verify(token, `${JWT_SECRET}`);
      req.user = payload;
      next();
    } catch (err) {
      next(new AuthorizationError(401));
    }
  }
};

module.exports = auth;
