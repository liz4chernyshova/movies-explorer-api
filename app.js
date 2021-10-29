require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');


const { PORT = 3000 } = process.env;
const app = express();

app.use(router);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.use(
    cors({
      origin: [
        'https://api.chernyshova.backend.nomoredomains.rocks',
        'http://api.chernyshova.backend.nomoredomains.rocks',
        'http://localhost:3000',
      ],
      credentials: true,
    }),
  );*/

app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errors());
app.use(errorLogger); 
app.use(errorHandler);
app.use(requestLogger);

app.listen(PORT);