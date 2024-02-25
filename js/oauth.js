clientId = "60752f3b45744b0dabdd0c951db7f4c9";
redirectUri = "localhost:5500";

const spotifyUrl = `htpps://acocounts.spotify.com/authorie?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private`;

function login() {
  window.location.href = spotifyUrl;
}



