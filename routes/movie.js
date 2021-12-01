const router = require('express').Router();
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validator');
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getAllMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
