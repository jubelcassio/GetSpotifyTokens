var SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');


// Prompts the user for input
function prompt(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}


function createsSetupFile() {
    json = JSON.stringify({
        clientId: "", clientSecret: "", redirectUri: "",
        access_token: "", refresh_token: "", scopes: []
    });
    fs.writeFileSync("setup.json", json, "utf8")
    console.log("setup.json created.")
    console.log("Please fill it with the clientId, clientSecret and redirectURL " +
                "before running the script again"
    )
    process.exit();
}


// Load credentials
var rawsetup;
try { 
    rawsetup = fs.readFileSync('setup.json', 'utf8');
} catch(err ) {
    // If the credentials file does not exist, create one
    if (err.code === 'ENOENT') {
        createsSetupFile();
    }
}

// Set up the credentials
var setup = JSON.parse(rawsetup);
scopes = setup.scopes
creds = {
    clientId: setup.clientId,
    clientSecret: setup.clientSecret,
    redirectUri: setup.redirectUri
}

// Initializes the api and outputs the authorization URL
var spotifyApi = new SpotifyWebApi(creds);
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
console.log(authorizeURL);

// Requests the user to input the auth code
// Updates the setup file with the given input
prompt("Insert the code: ", (input) => {
    setup.code = input.toString();
    fs.writeFileSync('setup.json', JSON.stringify(setup), 'utf8');
    process.exit();
})