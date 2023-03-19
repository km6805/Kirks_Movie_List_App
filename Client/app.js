const baseURL = "http://localhost:4500";

const list = document.getElementById("movie-list");
const deleteBtn = document.getElementsByTagName("button");

let movies = new Array();

const getList = () => {
  axios.get(`${baseURL}/api/movies`).then(({ data }) => {
    movies = data;
    displayMovieList();
  });
};

const submitHandler = (e) => {
  e.preventDefault();
  const titleTextBox = document.getElementById("title");
  const descriptionTextBox = document.getElementById("description");
  const imageURLTextBox = document.getElementById("imageURL");
  let body = {
    title: titleTextBox.value,
    description: descriptionTextBox.value,
    imageURL: imageURLTextBox.value,
  };
  createMovie(body);
  titleTextBox.value = "";
  descriptionTextBox.value = "";
  imageURLTextBox.value = "";
};
const createMovie = (body) => {
  axios
    .post(`${baseURL}/api/movies`, body)
    .then(({ data }) => {
      movies.push(data);
      displayMovieList();
    })
    .catch(displayError);
};

const displayError = (err) => {
  const errMsg = document.getElementById("errMesg");
  console.log(err, "Error");
  errMsg.innerText = err?.response?.data || "unknown error";
};

const deleteName = (e, id) => {
  axios.delete(`${baseURL}/api/name/:${id}`);
  nameArr.splice(
    nameArr.findIndex((e) => id === e.id),
    1
  );
  displayMovieList();
};

function displayMovieList() {
  const list = document.getElementById("movie-list");
  list.innerHTML = "";
  movies.forEach((movie) => {
    list.innerHTML += makeItem(movie);
  });
}
function deleteMovie(e, id) {
  axios.delete(`${baseURL}/api/movies/${id}`);
  movies.splice(
    movies.findIndex((e) => id === e.id),
    1
  );
  displayMovieList();
}
const makeItem = (movie) => {
  let html = `
  <div class="movieCard">
    <div class="imageContainer">
      <img src="${movie.imageURL}"/>
    </div>
    <div class="movieText">
      <h2>${movie.title}</h2>
      <p>${movie.description}</p>
      <div class="rating">`;
  for (let i = 1; i <= 5; i++) {
    if (i <= movie.rating) {
      html += `<i class="fa-solid fa-star" onclick="updateRating(${movie.id}, ${i})"></i>`;
    } else {
      html += `<i class="fa-regular fa-star" onclick="updateRating(${movie.id}, ${i})"></i>`;
    }
  }
  html += `</div>
  <button onclick="deleteMovie(this,${movie.id})">Delete</button>
  </div> 
  </div>`;
  return html;
};

function updateRating(id, rating) {
  let body = { rating: rating };
  axios.patch(`${baseURL}/api/movies/${id}`, body).then((response) => {
    const savedMovie = response.data;
    let index = movies.findIndex((elem) => elem.id === savedMovie.id);
    movies[index].rating = savedMovie.rating;
    displayMovieList();
  });
}

function startup() {
  const form = document.querySelector("form");
  form.addEventListener("submit", submitHandler);
  getList();
}

document.addEventListener("DOMContentLoaded", startup);
