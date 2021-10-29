const express = require('express');
const router = express.Router();
const { createUser, login, signOut } = require('../controllers/user');
const userRouter = require('./user');
const moviesRouter = require('./movie');
const Error404 = require('../errors/ErrorNotFound');
const auth = require('../middlewares/auth');

router.post('/signup', createUser);
router.post('/signin', login);
router.delete('/signout', signOut);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.all('*', (req, res, next) => next(new Error404('Ресурс не найден')));

module.exports = router;