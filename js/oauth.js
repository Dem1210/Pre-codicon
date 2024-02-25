clientId = "";
redirectUri = "";

const spotifyUrl = `htpps://acocounts.spotify.com/authorie?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private`;

function login() {
  window.location.href = spotifyUrl;
}
