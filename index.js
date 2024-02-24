require("dotenv").config();

// Credenciales de la aplicacion
client_id = process.env.CLIENT_ID;
client_secret = process.env.CLIENT_SECRET;

// Api Spotify
const spotify_api = "https://accounts.spotify.com/api/token";

// Boton de prueba
obtener_token = document.getElementById("request");

obtener_token.addEventListener("click", function () {
	
});

  const request = new Request(spotify_api, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
  });

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
const token = 'BQALodILZAGme97UcYW06ZWz-YDGKAzXm0fZ4rlFsTqE7eVs9Dax3ScovL9xeMfTB7Q9AUf4ngPV5aU5uqtMHnzIWsFxrzyJBJn4Liq_2JWZcEAYxE_Haw-ztLUKjDYRPkmMh74ZfrKIO-Y-ez6MCvFvsrh73EEinm7rDER0UmbkvEIE8GeqZeCDRuRJbHKKTShMiC1_ihsK6lGVblY-t1talTxZ08oLMoQvC4YxWJGzFXicsegeG5wEb33_';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);

//

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQALodILZAGme97UcYW06ZWz-YDGKAzXm0fZ4rlFsTqE7eVs9Dax3ScovL9xeMfTB7Q9AUf4ngPV5aU5uqtMHnzIWsFxrzyJBJn4Liq_2JWZcEAYxE_Haw-ztLUKjDYRPkmMh74ZfrKIO-Y-ez6MCvFvsrh73EEinm7rDER0UmbkvEIE8GeqZeCDRuRJbHKKTShMiC1_ihsK6lGVblY-t1talTxZ08oLMoQvC4YxWJGzFXicsegeG5wEb33_';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

const topTracksIds = [
  '5UlnuulVAVmmesw4VzqHdG','3JvKfv6T31zO0ini8iNItO','1c1sdxrYLIiuJOlE7PPttb','4Oih3RDrSFg3afaOphBVuy','5IAESfJjmOYu7cHyX557kz'
];

async function getRecommendations(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
  )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);