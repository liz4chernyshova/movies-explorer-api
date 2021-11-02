const router = require('express').Router();
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validator');

router.get('/', getAllMovies);

router.post('/', validateCreateMovie, createMovie);

router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
