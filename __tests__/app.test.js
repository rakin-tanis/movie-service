import app from "../app/app.js";
import supertest from "supertest";
import { movies } from "../testData.js";
import lodash from "lodash";
import movieRepository from "../app/repository/movieRepository.js";

const request = supertest(app);

beforeEach(() => {
  movieRepository.clear();
});

describe("save endpoint: POST /api/movie", () => {
  it("it should return 200 status code", async () => {
    const response = await request.post("/api/movie").send(movies[0]);
    expect(response.status).toBe(201);
  });

  it("it should return successfully created movie with uuid", async () => {
    const response = await request.post("/api/movie").send(movies[0]);
    const expectedId = expect.stringMatching(
      /\b(uuid:){0,1}s*([a-f0-9\\-]*){1}s*/
    );
    expect(response.body.id).toEqual(expectedId);
    expect(response.body.title).toBe(movies[0].title);
    expect(response.body.director).toBe(movies[0].director);
    expect(response.body.release_date).toBe(movies[0].release_date);
  });

  it("it should return 400 with a proper error message when director field is missing", async () => {
    const movie = lodash.cloneDeep(movies[0]);
    delete movie.director;
    const response = await request.post("/api/movie").send(movie);
    expect(response.status).toBe(400);
    expect(response.body.name).toEqual("Parameter Missing");
    expect(response.body.message).toBe('"director" is required');
    expect(response.body.statusCode).toBe(400);
    expect(response.body.date).toBeDefined();
  });

  it("it should return 400 with a proper error message when title is empty", async () => {
    const movie = lodash.cloneDeep(movies[0]);
    movie.title = "";
    const response = await request.post("/api/movie").send(movie);
    expect(response.status).toBe(400);
    expect(response.body.name).toEqual("Invalid Parameter");
    expect(response.body.message).toBe('"title" is not allowed to be empty');
    expect(response.body.statusCode).toBe(400);
    expect(response.body.date).toBeDefined();
  });

  it("it should return 400 with a proper error message when release_date is invalid", async () => {
    const movie = lodash.cloneDeep(movies[0]);
    movie.release_date = "2021-13-27";
    const response = await request.post("/api/movie").send(movie);
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.name).toEqual("Invalid Parameter");
    expect(response.body.message).toBe(
      '"release_date" must be in YYYY-MM-DD format'
    );
    expect(response.body.statusCode).toBe(400);
    expect(response.body.date).toBeDefined();
  });
});

describe("getAll endpoint: GET /api/movie", () => {
  it("it should return 404 status code and proper error message when no movie in the database", async () => {
    const response = await request.get("/api/movie");
    expect(response.status).toBe(404);
    expect(response.body.name).toEqual("Movie Not Found");
    expect(response.body.message).toBe("No movies found in the database.");
    expect(response.body.statusCode).toBe(404);
    expect(response.body.date).toBeDefined();
  });

  it("it should return 200 status code with all movies in response body", async () => {
    const moviesResponse = [];
    for (const movie of movies) {
      const res = await request.post("/api/movie").send(movie);
      moviesResponse.push(res.body);
    }

    const response = await request.get("/api/movie");
    expect(response.status).toBe(200);
    expect(lodash.isEqual(response.body, moviesResponse)).toBeTruthy();
  });
});

describe("get one endpoint: GET /api/Movie/:id", () => {
  it("it should return 200 status code the movie has the given id", async () => {
    const res = await request.post("/api/movie").send(movies[0]);

    const response = await request.get(`/api/movie/${res.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(res.body.id);
    expect(response.body.title).toBe(res.body.title);
    expect(response.body.director).toBe(res.body.director);
    expect(response.body.release_date).toBe(res.body.release_date);
  });

  it("it should return 400 status code and proper error message when invalid id sent", async () => {
    const res = await request.post("/api/movie").send(movies[0]);

    const response = await request.get(`/api/movie/${res.body.id}3`);
    expect(response.status).toBe(400);
    expect(response.body.name).toEqual("Invalid Parameter");
    expect(response.body.message).toBe('"value" must be a valid GUID');
    expect(response.body.statusCode).toBe(400);
    expect(response.body.date).toBeDefined();
  });

  it("it should return 404 status code and proper error message when there is no user with that id", async () => {
    const response = await request.get(
      `/api/movie/b528277e-202a-4f35-b0ca-248f8e24dbea`
    );
    expect(response.status).toBe(404);
    expect(response.body.name).toEqual("Movie Not Found");
    expect(response.body.message).toBe(
      "The movie with the id: b528277e-202a-4f35-b0ca-248f8e24dbea not found in the database."
    );
    expect(response.body.statusCode).toBe(404);
    expect(response.body.date).toBeDefined();
  });
});

describe("update endpoint: PUT /api/movie", () => {
  it("it should return 200 status code with the updated movie has the given id", async () => {
    const res = await request.post("/api/movie").send(movies[0]);
    const updated = {
      title: "Batman Begins",
      director: "Christopher Nolan",
      release_date: "2005-04-27",
    };

    const response = await request
      .put(`/api/movie/${res.body.id}`)
      .send(updated);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(res.body.id);
    expect(response.body.title).toBe(updated.title);
    expect(response.body.director).toBe(updated.director);
    expect(response.body.release_date).toBe(updated.release_date);
  });

  it("it should return 404 status code and proper error message when there is no user with that id", async () => {
    const updated = {
      title: "Batman Begins",
      director: "Christopher Nolan",
      release_date: "2005-04-27",
    };

    const response = await request
      .put(`/api/movie/b528277e-202a-4f35-b0ca-248f8e24dbea`)
      .send(updated);
    expect(response.status).toBe(404);
    expect(response.body.name).toEqual("Movie Not Found");
    expect(response.body.message).toBe(
      "The movie with the id: b528277e-202a-4f35-b0ca-248f8e24dbea not found in the database."
    );
    expect(response.body.statusCode).toBe(404);
    expect(response.body.date).toBeDefined();
  });

  it("it should return 400 status code and proper error message when invalid id sent", async () => {
    const res = await request.post("/api/movie").send(movies[0]);

    const updated = {
      title: "Batman Begins",
      director: "Christopher Nolan",
      release_date: "2005-04-27",
    };

    const response = await request
      .put(`/api/movie/b528277e-202a-4f35-b0ca-248f8e24`)
      .send(updated);
    expect(response.status).toBe(400);
    expect(response.body.name).toEqual("Invalid Parameter");
    expect(response.body.message).toBe('"value" must be a valid GUID');
    expect(response.body.statusCode).toBe(400);
    expect(response.body.date).toBeDefined();
  });
});

describe("delete endpoint: DELETE /api/movie", () => {
  it("it should return 200 status code with true in the body", async () => {
    const res = await request.post("/api/movie").send(movies[0]);

    const response = await request.delete(`/api/movie/${res.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });

  it("it should return 404 status code and proper error message when there is no user with that id", async () => {
    const response = await request.delete(
      `/api/movie/b528277e-202a-4f35-b0ca-248f8e24dbea`
    );
    expect(response.status).toBe(404);
    expect(response.body.name).toEqual("Movie Not Found");
    expect(response.body.message).toBe(
      "The movie with the id: b528277e-202a-4f35-b0ca-248f8e24dbea not found in the database."
    );
    expect(response.body.statusCode).toBe(404);
    expect(response.body.date).toBeDefined();
  });

  it("it should return 400 status code and proper error message when invalid id sent", async () => {
    const res = await request.post("/api/movie").send(movies[0]);

    const response = await request.delete(
      `/api/movie/b528277e-202a-4f35-b0ca-248f8e`
    );
    expect(response.status).toBe(400);
    expect(response.body.name).toEqual("Invalid Parameter");
    expect(response.body.message).toBe('"value" must be a valid GUID');
    expect(response.body.statusCode).toBe(400);
    expect(response.body.date).toBeDefined();
  });
});
