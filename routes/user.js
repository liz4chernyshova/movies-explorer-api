const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUserInfo } = require('../controllers/user');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
}), updateUserInfo);

module.exports = router;