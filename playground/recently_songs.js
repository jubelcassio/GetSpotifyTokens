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


// Fetchs the genres of an album
async function fetchAlbumGenre(id) {
  const album_obj = await spotifyApi.getAlbum(id);
  return album_obj.body.genres;
}



// Fetchs the genres of an artist
async function fetchArtistGenre(id) {
  const artist_obj = await spotifyApi.getArtist(id);
  return artist_obj.body.genres;
}



// Fetchs music analysis data of a list of tracks
// More information at:
//  https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
async function fetchMusicAnalysis(id_list) {
  const analysis_data = await spotifyApi.getAudioFeaturesForTracks(id_list);
  return analysis_data;
}



async function fetchData() {
  // How many tracks to fetch (max is 50)
  const n_of_songs = 5;
  let database = [];

  const recent_tracks = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: n_of_songs
  });


  // Listing the ids of all tracks
  const id_list = [];
  for (var i = 0; i < n_of_songs; i++) {
    const track_obj = recent_tracks.body.items[i]
    id_list.push(track_obj.track.id);
  }
  const music_analysis = await fetchMusicAnalysis(id_list);


  // For each track we must get some additional info
  for (var i = 0; i < n_of_songs; i++) {

    // Raw object from the response
    const track_obj = recent_tracks.body.items[i];
    const analysis_obj = music_analysis.body.audio_features[i];
    const artist = await spotifyApi.getArtist(track_obj.track.album.artists[0].id);
    const album = await spotifyApi.getAlbum(track_obj.track.album.id);

    // Each track is a row in the database
    const row = {
      // Time the track was played
      "play_log": {
        "id": track_obj.track.id,
        "time_played": track_obj.played_at,
      },

      // Track data
      "track": {
        "name": track_obj.track.name,
        "id": track_obj.track.id,
        "popularity": track_obj.track.popularity,
        "duration_ms": track_obj.track.duration_ms,
  
        // Audio analysis on the track
        "acousticness": analysis_obj.acousticness,
        "danceability": analysis_obj.danceability,
        "energy": analysis_obj.energy,
        "instrumentalness": analysis_obj.instrumentalness,
        "key": analysis_obj.key,
        "liveness": analysis_obj.liveness,
        "loudness": analysis_obj.loudness,
        "mode": analysis_obj.mode,
        "speechiness": analysis_obj.speechiness,
        "tempo": analysis_obj.tempo,
        "time_signature": analysis_obj.time_signature,
        "valence": analysis_obj.valence,
      },

      // Album data
      "album": {
        "name": album.body.name,
        "id": album.body.id,
        "genre": album.body.genres,
        "popularity": album.body.popularity,
        "release": album.body.release_date,
      },

      // Artist data
      "artist": {
        "name": artist.body.name,
        "id": artist.body.id,
        "genre": artist.body.genres,
        "popularity": artist.body.popularity,
      }
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


run().then((database) => {
  fs.writeFileSync("playground/database.json", JSON.stringify(database))
  console.log("Data saved into database.json")
});