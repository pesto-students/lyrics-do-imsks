const formSelector = document.querySelector(".search__form");
const searchFieldSelector = document.getElementById("search__song");
const songsSelector = document.getElementById("songs__data");
const paginateSelector = document.getElementById("paginate__buttons");

// Setting values
const currentPage = 1;
const noOfSongsPerPage = 5;

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
    .then((data) => {
    //   console.log(data);

      songsSelector.innerHTML = data.data
        .map(
          (song) =>
            `<div class="song">
                <h3 class="song__heading">${song.artist.name} - ${song.title}</h3>
                <button class="lyrics__button" id="lyrics" artistName = "${song.artist.name}" title = "${song.title}">Show Lyrics</button>
            </div>
            `
        )
        .join("");
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
