const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Load OAuth2 credentials
const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const { client_secret, client_id, redirect_uris } = credentials.web;

// Initialize OAuth2 client
const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

// Serve static files (like HTML) from the public directory
app.use(express.static(path.join(__dirname, '..')));

// Define routes and handlers
app.get('/', (req, res) => {
  res.send('Hello, this is the root path!');
});

app.get('/auth', (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive.file',
  });
  res.redirect(authorizeUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.send('Authentication successful! You can now use the Google Drive API.');
  } catch (error) {
    res.status(500).send('Error during authentication: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});