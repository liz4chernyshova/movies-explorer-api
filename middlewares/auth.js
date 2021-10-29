const jwt = require('jsonwebtoken');
require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;
const Error401 = require('../errors/ErrorAuthorization');

const auth = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    next(new Error401('Необходима авторизация.'));
  } else {
    const token = cookie.replace('jwt=', '');
    let payload;

    try {
      payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret'}`);
      req.user = payload;
      next();
    } catch (err) {
      next(new Error401('Авторизация не прошла.'));
    }
  }
};

module.exports = auth;