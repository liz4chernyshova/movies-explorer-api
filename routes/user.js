const router = require('express').Router();
const { getCurrentUser, updateUserInfo } = require('../controllers/user');
const { validateUpdateUserInfo } = require('../middlewares/validator');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
