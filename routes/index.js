const router = require('express').Router();
const usersRouter = require('./user');
const moviesRouter = require('./movie');
const { createUser, login } = require('../controllers/user');
const { validateSignIn, validateSignUp } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);

module.exports = router;
