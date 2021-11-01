const Movie = require('../models/movie'); 
const Error400 = require('../errors/ErrorBadRequest');
const Error403 = require('../errors/ErrorForbidden');
const Error404 = require('../errors/ErrorNotFound');
const Error500 = require('../errors/ServerError');

const getAllMovies = (req, res, next) => {
    Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch(() => {
      next(new Error500('На сервере произошла ошибка.'));
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
        next(new Error400('Переданы некорректные данные'));
      } else {
        next(new Error500('На сервере произошла ошибка.'));
      }
    });
  };

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new Error404('Фильм не найден.');
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        next(new Error403('Доступ запрещен.'));
      } else {
        movie.remove();
        res.status(200).send(movie);
      }
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new Error400('Ошибка в запросе.'));
      } else if (err.statusCode === 404) {
        next(new Error404('Фильм не найден.'));
      } else {
        next(new Error500('На сервере произошла ошибка.'));
      }
    });
};

module.exports = {
    getAllMovies,
    createMovie,
    deleteMovie,
};