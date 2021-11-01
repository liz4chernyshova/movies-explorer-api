const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getAllMovies);

router.post('/', createMovie);

router.delete('/:movieId', celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }), deleteMovie);

module.exports = router;