class AuthorizationError extends Error {
  constructor(status) {
    super(status);
    this.statusCode = status;
    this.message = this.errorMessage();
  }

  errorMessage() {
    if (this.statusCode === 401) {
      this.message = 'Необходимо авторизироваться.';
    } else if (this.statusCode === 400) {
      this.message = 'Переданы некорректные данные.';
    } else if (this.statusCode === 500) {
      this.message = 'Ошибка на сервере.';
    }
  }
}

module.exports = AuthorizationError;
