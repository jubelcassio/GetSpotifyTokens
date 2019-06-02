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
code = setup.code


// Initializes the api
var spotifyApi = new SpotifyWebApi(creds);

// Updates the access and refresh tokens in the setup.json file
spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      setup.access_token = data.body['access_token'];
      setup.refresh_token = data.body['refresh_token'];

      console.log('Access token:\n' + data.body['access_token']);
      console.log('Expires in:\n' + data.body['expires_in']);
      console.log('Refresh token:\n' + data.body['refresh_token']);
      
      fs.writeFileSync("setup.json", JSON.stringify(setup), 'utf8');
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
  