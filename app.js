const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const UserError = require('./errors/UserError');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());

const { PORT = 3000 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(
  cors({
    origin: [
      'https://movies-liz4chernyshova.nomoredomains.work',
      'http://movies-liz4chernyshova.nomoredomains.work',
      'https://localhost:3000',
      'http://localhost:3000',
      'https://178.154.198.147:3000',
      'http://178.154.198.147:3000',
    ],
    credentials: true,
  }),
);

app.use(requestLogger);

app.use(limiter);

app.use(router);

router.all('*', (req, res, next) => next(new UserError(404, 'Ресурс не найден')));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
