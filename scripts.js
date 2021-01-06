const formSelector = document.querySelector(".search__form");
const searchFieldSelector = document.getElementById("search__song");
const songsSelector = document.getElementById("songs__data");
const paginateSelector = document.getElementById("paginate__buttons");

// Setting values
let currentPage = 1;
const noOfSongsPerPage = 5;
let allSongs = [];
let currecntShowingSongs = [];

paginateSelector.style.display = "none";

// Events Handling
// 1. Input Search
formSelector.addEventListener("submit", (e) => {
  e.preventDefault();

  const term = searchFieldSelector.value;

  const suggestUrl = "https://api.lyrics.ovh/suggest/" + term;
  // console.log(suggestUrl);
  fetchSongs(suggestUrl);
});

// 2. Songs
songsSelector.addEventListener("click", (e) => {
  var element = e.target;

  if (
    element.nodeName == "BUTTON" &&
    element.classList.contains("lyrics__button")
  ) {
    const songInfo = e.path.find((item) => {
      return item.classList.contains("lyrics__button");
    });

    if (songInfo) {
      const artistName = songInfo.getAttribute("artistName");
      const songTitle = songInfo.getAttribute("title");
      // Fetching the lyrics
      fetchLyrics(artistName, songTitle);
    }
  } else {
    return false;
  }
});

// Fetching the songs
const fetchSongs = (word) => {
  // Sending request
  fetch(word)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      paginateSelector.style.display = "flex";

      // Hide Prev on 1st page
      if (currentPage === 1) {
        document.getElementById("paginate__prev__button").style.display =
          "none";
      }

      allSongs = res.data;

      let html = [];
      for (let i = 0; i < currentPage * noOfSongsPerPage; i++) {
        html.push(
          `<div class="song">
                <h3 class="song__heading">${allSongs[i].artist.name} - ${allSongs[i].title}</h3>
                <button class="lyrics__button" id="lyrics" artistName = "${allSongs[i].artist.name}" title = "${allSongs[i].title}">Show Lyrics</button>
            </div>
            `
        );
      }

      songsSelector.innerHTML = html;
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Fetching a song's lyrics
const fetchLyrics = (artist, title) => {
  const lyricsApiUrl = "https://api.lyrics.ovh/v1/" + artist + "/" + title;

  fetch(lyricsApiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      paginateSelector.innerHTML = ``;

      if (data.lyrics !== "") {
        var formattedString = data.lyrics.replace(/(\r|\n)/g, "<br>");
        songsSelector.innerHTML = `<h1 class="lyrics__heading"><b>${artist}</b> - ${title}</h1>
                <p class="lyrics">${formattedString}</p>`;
      } else {
        songsSelector.innerHTML = `<h1 class="lyrics__heading">Lyrics Not Found</h1>`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Prev Button Pressed
document
  .getElementById("paginate__prev__button")
  .addEventListener("click", (e) => {
    currentPage = currentPage - 1;

    // if no more songs left to show
    if (currentPage * noOfSongsPerPage <= 0) {
      document.getElementById("paginate__prev__button").style.display = "none";
    } else {
      let html = [];
      for (
        let i = (currentPage - 1) * noOfSongsPerPage;
        i < currentPage * noOfSongsPerPage;
        i++
      ) {
        html.push(
          `<div class="song">
                <h3 class="song__heading">${allSongs[i].artist.name} - ${allSongs[i].title}</h3>
                <button class="lyrics__button" id="lyrics" artistName = "${allSongs[i].artist.name}" title = "${allSongs[i].title}">Show Lyrics</button>
            </div>
            `
        );
      }

      songsSelector.innerHTML = html;
    }
  });

// Next Button Pressed
document
  .getElementById("paginate__next__button")
  .addEventListener("click", (e) => {
    currentPage = currentPage + 1;

    document.getElementById("paginate__prev__button").style.display = "flex";

    // if no more songs left to show
    if (currentPage * noOfSongsPerPage >= allSongs.length) {
      document.getElementById("paginate__next__button").style.display = "none";
    } else {
      let html = [];
      for (
        let i = (currentPage - 1) * noOfSongsPerPage;
        i < currentPage * noOfSongsPerPage;
        i++
      ) {
        html.push(
          `<div class="song">
                  <h3 class="song__heading">${allSongs[i].artist.name} - ${allSongs[i].title}</h3>
                  <button class="lyrics__button" id="lyrics" artistName = "${allSongs[i].artist.name}" title = "${allSongs[i].title}">Show Lyrics</button>
              </div>
              `
        );
      }

      songsSelector.innerHTML = html;
    }
  });
