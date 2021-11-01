require('dotenv').config();
const process = require('process');

const { NODE_ENV, JWT_SECRET, DB_URL } = process.env;

const secretKey = {
    JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
};

const mongoURL = {
    DB_URL: NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/bitfilmsdb',
};

module.exports = {
    secretKey,
    mongoURL,
};