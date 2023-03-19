const express = require("express");
const axios = require("axios");
const cors = require("cors");
const MOVIES = require("./{} db.json");

let globalId = 20;
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("../index"));

app.get("/api/movies", (req, res) => {
  res.status(200).send(MOVIES);
});
app.get("/api/movies/:id", (req, res) => {
  let index = MOVIES.findIndex((elem) => elem.id === +req.params.id);
  if (index === -1) {
    res.status(404).send("Movie doesn't exist");
  }
  res.status(200).send(MOVIES[index]);
});
app.post("/api/movies", (req, res) => {
  const movie = req.body;
  if (!movie || !movie.title) {
    res.status(400).send("Invalid Title");
  } else {
    res.status(200).send(createMovie(movie));
  }
});
app.patch(`/api/movies/:id`, (req, res) => {
  const body = req.body;
  let index = MOVIES.findIndex((elem) => elem.id === +req.params.id);
  if (index === -1) {
    res.status(404).send("Movie doesn't exist");
    return;
  }
  if (body.rating === 0 || body.rating) {
    if (isNaN(body.rating) || body.rating < 0 || body.rating > 5) {
      res.status(400).send("Rating should be between 0 to 5");
      return;
    }
    MOVIES[index].rating = body.rating;
  }
  if (body.title) {
    MOVIES[index].title = body.title;
  }
  if (body.description) {
    MOVIES[index].description = body.description;
  }
  if (body.imageURL) {
    MOVIES[index].imageURL = body.imageURL;
  }

  res.status(200).send(MOVIES[index]);
});
const createMovie = (body) => {
  const movie = {
    id: globalId,
    title: body.title,
    description: body.description || "",
    imageURL: body.imageURL || "",
    rating: 0,
  };
  MOVIES.push(movie);
  globalId++;
  return movie;
};
app.delete("/api/movies/:id", (req, res) => {
  let index = MOVIES.findIndex((elem) => elem.id === +req.params.id);
  MOVIES.splice(index, 1);
  res.status(200).send(MOVIES);
});
app.put("/api/movies/:id", (req, res) => {
  const movie = req.body;
  let index = MOVIES.findIndex((elem) => elem.id === +req.params.id);
  if (index === -1) {
    res.status(404).send("Title doesn't exist");
  }
  if (movie.id !== +req.params.id) {
    res.status(400).send("Id mismatch");
  }
  if (!movie.movieName) {
    res.status(400).send("Incomplete data");
  }
  MOVIES.splice(index, 1);
  MOVIES.push(movie);
  res.status(200).send(movie);
});

const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
