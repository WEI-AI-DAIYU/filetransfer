const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Load OAuth2 credentials
const credentialsPath = path.join(__dirname, '../credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));
const { client_secret, client_id, redirect_uris } = credentials.web;

// Initialize OAuth2 client
const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

// Now you can use oAuth2Client for OAuth operations
