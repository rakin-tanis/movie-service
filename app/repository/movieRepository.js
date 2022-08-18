import { v4 as uuid } from "uuid";
import { MovieNotFoundError } from "../error/errors.js";

let movies = [];

export const getAll = () => movies;

export const get = (id) => {
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    throw new MovieNotFoundError({
      message: `The movie with the id: ${id} not found in the database.`,
    });
  }
  return movie;
};

export const save = (movie) => {
  const id = uuid();
  movie.id = id;
  movies.push(movie);
  return movie;
};

export const update = (id, movie) => {
  const mov = get(id);
  mov.title = movie.title;
  mov.director = movie.director;
  mov.release_date = movie.release_date;
  return mov;
};

export const remove = (id) => {
  const movie = get(id);
  movies = movies.filter((mov) => mov.id != movie.id);
  return true;
};

export const clear = () => {
  movies = [];
};

export default {
  getAll,
  get,
  save,
  update,
  remove,
  clear,
};
