const express = require("express");
const { validateMovie, validateUser } = require("./validators.js");
require("dotenv").config();

const app = express();

const port = process.env.APP_PORT ?? 5000;

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyTokenId,
} = require("./auth.js");

app.get("/", welcome);
app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.post("/api/users", hashPassword, validateUser, usersHandlers.postUser);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

app.use(verifyToken);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.use(verifyTokenId);

app.put("/api/users/:id", hashPassword, validateUser, usersHandlers.updateUser);
app.delete("/api/users/:id", usersHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
