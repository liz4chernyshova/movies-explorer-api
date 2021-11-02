const router = require('express').Router();
const { getCurrentUser, updateUserInfo } = require('../controllers/user');
const { validateUpdateUserInfo } = require('../middlewares/validator');

router.get('/me', getCurrentUser);

router.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
