const express = require('express');

const router = express.Router();
const { createUser, login, signOut } = require('../controllers/user');
const { validateSignIn, validateSignUp } = require('../middlewares/validator');
const userRouter = require('./user');
const moviesRouter = require('./movie');
const UserError = require('../errors/UserError');
const auth = require('../middlewares/auth');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.delete('/signout', signOut);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.all('*', (req, res, next) => next(new UserError(404, 'Ресурс не найден')));

module.exports = router;
