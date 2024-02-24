require("dotenv").config();

// Credenciales de la aplicacion
client_id = process.env.CLIENT_ID;
client_secret = process.env.CLIENT_SECRET;

// Api Spotify
const spotify_api = "https://accounts.spotify.com/api/token";

// Boton de prueba
obtener_token = document.getElementById("request");

obtener_token.addEventListener("click", function () {});

const request = new Request(spotify_api, {
  method: "GET",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
});

const APIController = (function() {
    
const clientId = '60752f3b45744b0dabdd0c951db7f4c9';
const clientSecret = '9c7c9480f1444094a80144e8da001055';

const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

const _getGenres = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.categories.items;
}

const _getPlaylistByGenre = async (token, genreId) => {

    const limit = 10;
    
    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.playlists.items;
}

const _getTracks = async (token, tracksEndPoint) => {

    const limit = 10;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.items;
}

const _getTrack = async (token, trackEndPoint) => {

    const result = await fetch(`${trackEndPoint}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data;
}

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
    }
}
})();


fetch(request)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  })
  .then((data) => {
    // Procesar la respuesta JSON
    console.log(data);
  })
  .catch((error) => {
    // Manejar el error
    console.error(error);
  });

//PARA TOP TRACKS
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token =
  "BQALodILZAGme97UcYW06ZWz-YDGKAzXm0fZ4rlFsTqE7eVs9Dax3ScovL9xeMfTB7Q9AUf4ngPV5aU5uqtMHnzIWsFxrzyJBJn4Liq_2JWZcEAYxE_Haw-ztLUKjDYRPkmMh74ZfrKIO-Y-ez6MCvFvsrh73EEinm7rDER0UmbkvEIE8GeqZeCDRuRJbHKKTShMiC1_ihsK6lGVblY-t1talTxZ08oLMoQvC4YxWJGzFXicsegeG5wEb33_";
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({ name, artists }) =>
      `${name} by ${artists.map((artist) => artist.name).join(", ")}`
  )
);

const topTracksIds = [
  "5UlnuulVAVmmesw4VzqHdG",
  "3JvKfv6T31zO0ini8iNItO",
  "1c1sdxrYLIiuJOlE7PPttb",
  "4Oih3RDrSFg3afaOphBVuy",
  "5IAESfJjmOYu7cHyX557kz",
];

async function getRecommendations() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (
    await fetchWebApi(
      `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(",")}`,
      "GET"
    )
  ).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({ name, artists }) =>
      `${name} by ${artists.map((artist) => artist.name).join(", ")}`
  )
);
