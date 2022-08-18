class BaseError extends Error {
  name;
  message;
  date;
  stack;

  constructor(name, message, date, stack) {
    super(message);
    this.name = name;
    this.message = message;
    this.date = date;
    this.stack = stack;
  }
}

export class MovieNotFoundError extends BaseError {
  constructor({ name = "Movie Not Found", message, date = Date.now(), stack }) {
    super(name, message, date, stack);
  }
}

export class MissingParameterError extends BaseError {
  constructor({
    name = "Parameter Missing",
    message,
    date = Date.now(),
    stack,
  }) {
    super(name, message, date, stack);
  }
}

export class InvalidParameterError extends BaseError {
  constructor({
    name = "Invalid Parameter",
    message,
    date = Date.now(),
    stack,
  }) {
    super(name, message, date, stack);
  }
}
