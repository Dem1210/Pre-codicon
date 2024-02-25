async function crearPlaylistAgregarCanciones(
  token,
  nombrePlaylist = "Mi nueva playlist | T·Music",
  listaCanciones
) {
  // Crear la playlist
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const body = JSON.stringify({
    name: nombrePlaylist,
    description: "Playlist creada con T·Music utilizando la API de Spotify.",
    public: false,
  });

  const responsePlaylist = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    {
      method: "POST",
      headers,
      body,
    }
  );

  const dataPlaylist = await responsePlaylist.json();

  // Agregar canciones a la playlist
  const idPlaylist = dataPlaylist.id;
  const urisCanciones = listaCanciones.map(
    (cancion) => `spotify:track:${cancion}`
  );

  const bodyAgregarCanciones = JSON.stringify({
    uris: urisCanciones,
  });

  await fetch(`https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`, {
    method: "POST",
    headers,
    body: bodyAgregarCanciones,
  });

  console.log(
    `Playlist "${nombrePlaylist}" creada con éxito y canciones agregadas.`
  );
}

const token = "YOUR_ACCESS_TOKEN";
const nombrePlaylist = "Mi nueva playlist";
const listaCanciones = [
  "spotify:track:5zF78j5rCnQlS8944vD7Dt",
  "spotify:track:1234567890",
];

crearPlaylistAgregarCanciones(token, nombrePlaylist, listaCanciones);
