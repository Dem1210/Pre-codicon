const APIController = (function () {
  const clientId = "60752f3b45744b0dabdd0c951db7f4c9";
  const clientSecret = "9c7c9480f1444094a80144e8da001055";

  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    localStorage.setItem("spotify_token", data.access_token);
    return data.access_token;
  };

  const _getGenres = async (token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories?locale=es_MX`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.categories.items;
  };

  const _getPlaylistByGenre = async (token, genreId) => {
    const limit = 50;

    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.playlists.items;
  };

  const _getTracks = async (token, tracksEndPoint) => {
    const limit = 20;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.items;
  };

  const _getTrack = async (token, trackEndPoint) => {
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data;
  };

  return {
    getToken() {
      return _getToken();
    },
    getGenres(token) {
      return _getGenres(token);
    },
    getPlaylistByGenre(token, genreId) {
      return _getPlaylistByGenre(token, genreId);
    },
    getTracks(token, tracksEndPoint) {
      return _getTracks(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint);
    },
  };
})();

// UI Module
const UIController = (function () {
  const DOMElements = {
    selectGenre: "#select_genre",
    selectPlaylist: "#select_playlist",
    buttonSubmit: "#btn_submit",
    divSongDetail: "#song-detail",
    hfToken: "#hidden_token",
    divSonglist: ".song-list",
  };

  return {
    inputField() {
      return {
        genre: document.querySelector(DOMElements.selectGenre),
        playlist: document.querySelector(DOMElements.selectPlaylist),
        tracks: document.querySelector(DOMElements.divSonglist),
        submit: document.querySelector(DOMElements.buttonSubmit),
        songDetail: document.querySelector(DOMElements.divSongDetail),
      };
    },

    // need methods to create select list option
    createGenre(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document
        .querySelector(DOMElements.selectGenre)
        .insertAdjacentHTML("beforeend", html);
    },

    createPlaylist(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document
        .querySelector(DOMElements.selectPlaylist)
        .insertAdjacentHTML("beforeend", html);
    },

    createTrack(id, name, preview) {
      const html = `
      <li class="flex flex-col gap-4 items-center justify-center text-center rounded-lg p-2 w-full">
        <a class="list-group-item flex flex-col gap-4 items-center justify-center text-center rounded-lg transition-colors duration-300 ease-in-out w-full">
          <span class="text-balance font-bold text-white text-xs">${name}</span>
          <img src="${preview}" alt="${name}" class="w-full h-full aspect-square rounded-lg object-cover">
        </a>
        <div class="flex gap-1 w-full">
          <a class="btn btn-primary btn-sm text-xs w-[70%]" href="${id}">
            reproducir
          </a>
          <button class="btn btn-ghost btn-sm w-[30%] liked">
            <img src="./resources/svgs/heart_filled.svg" class="size-6" alt="like"/>
          </button>    
        </div>
      </li>`;
      document
        .querySelector(DOMElements.divSonglist)
        .insertAdjacentHTML("beforeend", html);
    },

    createTrackDetail(img, title, artist, preview_song) {
      const detailDiv = document.querySelector(DOMElements.divSongDetail);
      detailDiv.innerHTML = "";

      const html = `<audio src="${preview_song}" autoplay></audio>`;

      detailDiv.insertAdjacentHTML("beforeend", html);
    },

    resetTrackDetail() {
      this.inputField().songDetail.innerHTML = "";
    },

    resetTracks() {
      this.inputField().tracks.innerHTML = "";
      this.resetTrackDetail();
    },

    resetPlaylist() {
      this.inputField().playlist.innerHTML = "";
      this.resetTracks();
    },

    storeToken(value) {
      localStorage.setItem("spotify_token", value);
    },

    getStoredToken() {
      return {
        token: localStorage.getItem("spotify_token"),
      };
    },
  };
})();

const APPController = (function (UICtrl, APICtrl) {
  const DOMInputs = UICtrl.inputField();

  const loadGenres = async () => {
    const token = await APICtrl.getToken();
    UICtrl.storeToken(token);
    const genres = await APICtrl.getGenres(token);
    genres.forEach((element) => UICtrl.createGenre(element.name, element.id));
  };

  DOMInputs.genre.addEventListener("change", async () => {
    UICtrl.resetPlaylist();
    const token = UICtrl.getStoredToken().token;
    const genreSelect = UICtrl.inputField().genre;
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
    playlist.forEach((p) => UICtrl.createPlaylist(p.name, p.tracks.href));
  });

  DOMInputs.submit.addEventListener("click", async (e) => {
    e.preventDefault();
    UICtrl.resetTracks();
    const token = UICtrl.getStoredToken().token;
    const playlistSelect = UICtrl.inputField().playlist;
    const tracksEndPoint =
      playlistSelect.options[playlistSelect.selectedIndex].value;
    const tracks = await APICtrl.getTracks(token, tracksEndPoint);
    tracks.forEach((el) =>
      UICtrl.createTrack(
        el.track.href,
        el.track.name,
        el.track.album.images[1].url
      )
    );
  });

  DOMInputs.tracks.addEventListener("click", async (e) => {
    e.preventDefault();
    UICtrl.resetTrackDetail();
    const token = UICtrl.getStoredToken().token;
    const trackEndpoint = e.target.href;
    const track = await APICtrl.getTrack(token, trackEndpoint);
    UICtrl.createTrackDetail(
      track.album.images[2].url,
      track.name,
      track.artists[0].name,
      track.preview_url
    );
  });

  async function getRecommendationsAsync(token) {
    if (!token) {
      token = UICtrl.getStoredToken().token;
    }

    if (!token) {
      console.error("No token");
      return;
    }

    const popularGenres = ["rock", "pop", "hip-hop", "electronic", "country"];
    const randomGenre =
      popularGenres[Math.floor(Math.random() * popularGenres.length)];

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${randomGenre}&market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    const songs = data.tracks;
    const songTitles = songs.map((song) => song.name);
    const songURIs = songs.map((song) => song.uri);
    track.innerHTML = songTitles;
    artist.innerHTML = songs[0].artists[0].name;

    description.innerText = `
      Artista: ${songs[0].artists[0].name}
      Fecha de salida: ${songs[0].album.release_date}
      Cancion Nro: ${songs.indexOf(songs[0]) + 1}
      `;

    const albumURIs = songs.map((song) => song.album.images[0].url);
    album.src = albumURIs[0];

    let audio;
    play.addEventListener("click", () => {
      if (audio) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      } else {
        audio = new Audio(songs[0].preview_url);
        audio.play();
      }
    });
  }

  const album = document.getElementById("album-cover");
  const track = document.getElementById("song-name");
  const play = document.getElementById("play");
  const quite = document.getElementById("quite");
  const artist = document.getElementById("artist-name");
  const description = document.getElementById("song-description");
  const liked = document.getElementsByClassName("liked");

  const descubrir = document.getElementById("descubrir");
  descubrir.addEventListener("click", () => {
    getRecommendationsAsync();
  });

  return {
    init() {
      console.log("App is starting");
      loadGenres();
    },
  };
})(UIController, APIController);

APPController.init();
