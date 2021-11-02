class MovieError extends Error {
  constructor(status) {
    super(status);
    this.statusCode = status;
    this.message = this.errorMessage();
  }

  errorMessage() {
    if (this.statusCode === 400) {
      this.message = 'Переданы некорректные данные';
    } else if (this.statusCode === 404) {
      this.message = 'Фильм не найден.';
    } else if (this.statusCode === 403) {
      this.message = 'Доступ запрещен';
    } else if (this.statusCode === 500) {
      this.message = 'На сервере произошла ошибка.';
    }
  }
}

module.exports = MovieError;
