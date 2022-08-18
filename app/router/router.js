import express from "express";
import {
  getAllMovies,
  getMovie,
  saveMovie,
  updateMovie,
  deleteMovie,
} from "../controller/movieController.js";
import {
  checkRequiredForId,
  checkValidForId,
  checkRequiredForTitleDirectorReleaseDate,
  checkValidateForTitleDirectorReleaseDate,
} from "../middleware/paramInterceptor.js";

const router = express.Router();

router.get("/api/movie", getAllMovies);
router.get("/api/movie/:id", checkRequiredForId, checkValidForId, getMovie);
router.post(
  "/api/movie",
  checkRequiredForTitleDirectorReleaseDate,
  checkValidateForTitleDirectorReleaseDate,
  saveMovie
);
router.put("/api/movie/:id", checkRequiredForId, checkValidForId, updateMovie);
router.delete(
  "/api/movie/:id",
  checkRequiredForId,
  checkValidForId,
  deleteMovie
);

export default router;
