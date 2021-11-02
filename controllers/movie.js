const Movie = require('../models/movie');
const MovieError = require('../errors/UserError');

const getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch(() => {
      next(new MovieError(500));
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new MovieError(400));
      } else {
        next(new MovieError(500));
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (req.user._id.toString() === movie.owner.toString()) {
        return movie.remove()
          .then(() => res.status(200).send(movie));
      }
      throw new MovieError(403);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new MovieError(400));
      } else if (err.statusCode === 404) {
        next(new MovieError(404));
      } else {
        next(new MovieError(500));
      }
    });
};

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
