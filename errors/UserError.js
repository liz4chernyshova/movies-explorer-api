class UserError extends Error {
  constructor(status) {
    super(status);
    this.statusCode = status;
    this.message = this.errorMessage();
  }

  errorMessage() {
    if (this.statusCode === 400) {
      this.message = 'Переданы некорректные данные';
    } else if (this.statusCode === 404) {
      this.message = 'Пользователь не найден';
    } else if (this.statusCode === 401) {
      this.message = 'Неправильная почта или пароль.';
    } else if (this.statusCode === 409) {
      this.message = 'Пользователь уже зарегистрирован.';
    } else if (this.statusCode === 500) {
      this.message = 'На сервере произошла ошибка.';
    }
  }
}

module.exports = UserError;
