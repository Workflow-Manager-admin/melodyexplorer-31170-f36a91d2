require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for requests from the React frontend (usually http://localhost:3000 in dev)
app.use(cors({
  origin: '*', // In production, restrict this to your frontend's origin
}));

// PUBLIC_INTERFACE
/**
 * Retrieves a Spotify access token using the client credentials flow.
 * Reads client_id and client_secret from environment variables.
 * Returns: { access_token, token_type, expires_in } on success, or { error } on failure.
 * Endpoint: GET /getSpotifyToken
 */
app.get('/getSpotifyToken', async (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Spotify client credentials not set in environment.' });
  }

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authHeader,
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(500).json({
        error: tokenData.error_description || tokenData.error || 'Error retrieving Spotify token.',
      });
    }
    res.json(tokenData);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
