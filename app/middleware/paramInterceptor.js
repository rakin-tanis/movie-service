import {
  InvalidParameterError,
  MissingParameterError,
} from "../error/errors.js";
import DateExtension from "@joi/date";
import JoiImport from "joi";
const Joi = JoiImport.extend(DateExtension);

const movieSchemaRequired = Joi.object({
  title: Joi.required(),
  director: Joi.required(),
  release_date: Joi.required(),
});

const movieSchemaValid = Joi.object({
  title: Joi.string().min(3).max(30),
  director: Joi.string().min(3).max(30),
  release_date: Joi.date().format("YYYY-MM-DD").options({ convert: true }),
});

export const checkRequiredForTitleDirectorReleaseDate = (req, res, next) => {
  const { error } = movieSchemaRequired.validate(req.body);

  let message = "";
  if (error) {
    message += error.details.reduce((acc, item) => acc + item.message, "");
  }

  if (message) {
    throw new MissingParameterError({ message });
  }

  next();
};

export const checkValidateForTitleDirectorReleaseDate = (req, res, next) => {
  const { error } = movieSchemaValid.validate(req.body);

  let message = "";
  if (error) {
    message += error.details.reduce((acc, item) => acc + item.message, "");
  }

  if (message) {
    throw new InvalidParameterError({ message });
  }

  next();
};

export const checkRequiredForId = (req, res, next) => {
    const { error } = Joi.string().required().validate(req.params.id);
  
    const err = error;

    console.log(JSON.stringify(error));

    let message = "";
    if (error) {
      message += error.details.reduce((acc, item) => acc + item.message, "");
    }
  
    if (message) {
      throw new MissingParameterError({ message });
    }
  
    next();
  };

export const checkValidForId = (req, res, next) => {
  const { error } = Joi.string().guid().validate(req.params.id);

  console.log(error);

  let message = "";
  if (error) {
    message += error.details.reduce((acc, item) => acc + item.message, "");
  }

  if (message) {
    throw new InvalidParameterError({ message });
  }

  next();
};
