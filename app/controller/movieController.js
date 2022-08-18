import { MovieNotFoundError } from "../error/errors.js";
import movieRepository from "../repository/movieRepository.js";

export const getAllMovies = (req, res) => {
  const movies = movieRepository.getAll();
  if (!movies.length) {
    throw new MovieNotFoundError({
      message: "No movies found in the database.",
    });
  }
  res.status(200).json(movieRepository.getAll());
};

export const getMovie = (req, res) => {
  res.status(200).json(movieRepository.get(req.params.id));
};

export const saveMovie = (req, res) => {
  res.status(201).json(movieRepository.save(req.body));
};

export const updateMovie = (req, res) => {
  res.status(200).json(movieRepository.update(req.params.id, req.body));
};

export const deleteMovie = (req, res) => {
  res.status(200).json(movieRepository.remove(req.params.id));
};
