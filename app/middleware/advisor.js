import { HttpStatusCode } from "../error/httpStatusCodes.js";
import {
  InvalidParameterError,
  MissingParameterError,
  MovieNotFoundError,
} from "../error/errors.js";

export const advisor = (err, req, res, next) => {
  console.log("error", err);

  switch (true) {

    case err instanceof MovieNotFoundError:
      res.status(HttpStatusCode.NOT_FOUND).json({
        name: err.name,
        message: err.message,
        statusCode: HttpStatusCode.NOT_FOUND,
        date: new Date(err.date).toString(),
      });
      return;

    case err instanceof MissingParameterError:
      res.status(HttpStatusCode.BAD_REQUEST).json({
        name: err.name,
        message: err.message,
        statusCode: HttpStatusCode.BAD_REQUEST,
        date: new Date(err.date).toString(),
      });
      return;

    case err instanceof InvalidParameterError:
      res.status(HttpStatusCode.BAD_REQUEST).json({
        name: err.name,
        message: err.message,
        statusCode: HttpStatusCode.BAD_REQUEST,
        date: new Date(err.date).toString(),
      });
      return;

    default:
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        name: "Internal Server Error",
        message: "Something went wrong!",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        date: new Date(err.date).toString(),
      });
  }
};
