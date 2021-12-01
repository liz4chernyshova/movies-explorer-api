const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserError = require('../errors/UserError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new UserError(404));
      } else {
        next(new UserError(500));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserError(400));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new UserError(409));
      } else {
        next(new UserError(500));
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(req.user._id,
    { name, email },
    { new: true, runValidators: true })
    .orFail(() => {
      next(new UserError(404));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserError(400));
      } else if (err.statusCode === 404) {
        next(new UserError(404));
      } else if (err.name === 'MongoError' && err.statusCode === 409) {
        next(new UserError(409));
      } else {
        next(new UserError(500));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );

      res.status(200).send({ token });
    })
    .catch(next);
};

const signOut = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
    .then(() => res.status(200).send({ message: 'Вы вышли из системы' }));
};

module.exports = {
  createUser,
  updateUserInfo,
  getCurrentUser,
  login,
  signOut,
};
