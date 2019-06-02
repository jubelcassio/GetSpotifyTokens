var SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

// Load and setup credentials
var rawsetup = fs.readFileSync('setup.json', 'utf8');
var setup = JSON.parse(rawsetup);

creds = {
    clientId: setup.clientId,
    clientSecret: setup.clientSecret,
    redirectUri: setup.redirectUri
}

access_token = setup.access_token;
refresh_token = setup.refresh_token;

// Initializes the api
var spotifyApi = new SpotifyWebApi(creds);
spotifyApi.setAccessToken(access_token);
spotifyApi.setRefreshToken(refresh_token);

// Updates the access and refresh tokens in the setup.json file
spotifyApi.refreshAccessToken().then(
  function(data) {
    console.log("Refreshing access token.")
    setup.access_token = data.body['access_token'];
    
    fs.writeFileSync("setup.json", JSON.stringify(setup), 'utf8');
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
)