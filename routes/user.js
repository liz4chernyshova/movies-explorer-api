const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getCurrentUser,
    updateUserInfo,
  } = require('../controllers/user');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
}), updateUserInfo);

module.exports = router;