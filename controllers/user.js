require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const User = require('../models/user');
const Error400 = require('../errors/ErrorBadRequest');
const Error401 = require('../errors/ErrorAuthorization');
const Error404 = require('../errors/ErrorNotFound');
const Error409 = require('../errors/ErrorConflict');
const Error500 = require('../errors/ServerError');


const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw (new Error404('Пользователь не найден'));
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new Error400('Переданы некорректные данные'));
      } else if (err.statusCode === 404) {
        next(new Error404('Пользователь не найден'));
      } else {
        next(new Error500('Ошибка на сервере.'));
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
        next(new Error400('Переданы некорректные данные.'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error409('Пользователь уже зарегистрирован.'));
      } else {
        next(new Error500('Ошибка на сервере.'));
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(req.user._id,
    { name, email },
    { new: true, runValidators: true })
    .orFail(() => {
      next(new Error404('Пользователь не найден'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные.'));
      } else if (err.statusCode === 404) {
        next(new Error404('Пользователь не найден'));
      } else {
        next(new Error500('Ошибка на сервере.'));
      }
    });
};


const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error400('Переданы некорректные данные.');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .send({ token });
    })
    .catch(() => {
      throw new Error401('Необходимо авторизоваться.');
    })
    .catch(next);
};

const signOut = (req, res) => {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .then((user) => res.status(200).send(user))
  };

module.exports = {
  createUser,
  updateUserInfo,
  getCurrentUser,
  login,
  signOut,
};