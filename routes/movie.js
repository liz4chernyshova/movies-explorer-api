const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getAllMovies,
    createMovie,
    deleteMovie,
  } = require('../controllers/movie');

router.get('/movies', getAllMovies);

router.post('/movies', createMovie);

router.delete('/movies/:movieId', celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }), deleteMovie);

module.exports = router;