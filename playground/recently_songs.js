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


// Fetches the genres of an album
async function fetchAlbumGenre(id) {
  const album_obj = await spotifyApi.getAlbum(id);
  return album_obj.body.genres;
}


// Fetches the genres of an artist
async function fetchArtistGenre(id) {
  const artist_obj = await spotifyApi.getArtist(id);
  return artist_obj.body.genres;
}


// Fetchs the data wanted
async function fetchData() {
  // Representing some database
  let database = [];

  // How many tracks to fetch (max is 50)
  const config = {limit: 5};
  const recent_tracks = await spotifyApi.getMyRecentlyPlayedTracks(config);

  // For each track we must get some additional info
  for (var i = 0; i<recent_tracks.body.items.length; i++) {

    // Raw object from the response
    const track_obj = recent_tracks.body.items[i];

    // Genres for this track
    const album_genres = await fetchAlbumGenre(track_obj.track.album.id);
    const artist_genres = await fetchArtistGenre(track_obj.track.album.artists[0].id);

    // Each track is a row in the database
    const row = {
      "name": track_obj.track.name,
      "popularity": track_obj.track.popularity,
      "time_played": track_obj.played_at,
      "duration_ms": track_obj.track.duration_ms,
      "album": track_obj.track.album.name,
      "album_genre": album_genres,
      "album_release": track_obj.track.album.release_date,
      "artist": track_obj.track.album.artists[0].name,
      "artist_genre": artist_genres,
    }
    database.push(row);
  }

  return database;
}


// A function to run'em all
async function run() {
  let response = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(response.body['access_token']);

  let database = await fetchData();
  return database;
}

const database = run();

console.log(database);