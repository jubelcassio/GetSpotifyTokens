var SpotifyWebApi = require('spotify-web-api-node');
var fs = require('fs');

// Load and setup credentials
var rawsetup = fs.readFileSync('setup.json', 'utf8');
var setup = JSON.parse(rawsetup);

creds = {
    clientId: setup.clientId,
    clientSecret: setup.clientSecret
}

// Initialize the api and sets the tokens
var spotifyApi = new SpotifyWebApi(creds);
spotifyApi.setAccessToken(setup.access_token);
spotifyApi.setRefreshToken(setup.refresh_token);

// Returns the authorized user's username
spotifyApi.getMe()
    .then(function(data) {
        console.log(data.body.display_name);
    }, function(err) {
        console.log(err);
    }
    )