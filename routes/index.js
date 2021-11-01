const express = require('express');
const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login, signOut } = require('../controllers/user');
const userRouter = require('./user');
const moviesRouter = require('./movie');
const Error404 = require('../errors/ErrorNotFound');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }), createUser);
router.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }), login);
router.delete('/signout', signOut);

//router.use(auth);

router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);
router.all('*', (req, res, next) => next(new Error404('Ресурс не найден')));

module.exports = router;