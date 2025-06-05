//
// Helper functions for interacting with the Spotify Web API
// NO client_id or client_secret are EVER referenced in this frontend code.
// All authentication goes through /getSpotifyToken from our backend (see backend.js).
//

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

// PUBLIC_INTERFACE
/**
 * Get a Spotify access token from the backend.
 * Uses the /getSpotifyToken endpoint to ensure client credentials stay secret.
 * Returns { access_token } or { error }
 */
export async function getSpotifyAccessToken() {
  try {
    // Always fetch the token from our backend proxy.
    const response = await fetch("/getSpotifyToken");
    const data = await response.json();
    if (!response.ok || data.error) {
      return { error: data.error_description || data.error || "Error obtaining Spotify token from backend." };
    }
    if (!data.access_token) {
      return { error: "No access token returned from backend." };
    }
    return { access_token: data.access_token };
  } catch (e) {
    return { error: e.message || "Could not obtain Spotify token from backend." };
  }
}

// --- Mapping language to relevant South Asian genres/keywords for Spotify search ---
const LANGUAGE_SPOTIFY_KEYWORDS = {
  Hindi: [
    "Bollywood music director",
    "Hindi film composer",
    "Hindi movies",
    "Bollywood songs"
  ],
  Tamil: [
    "Tamil film composer",
    "Kollywood music director",
    "Tamil movies",
  ],
  Telugu: [
    "Telugu film composer",
    "Tollywood music director",
    "Telugu movies",
  ],
  Kannada: [
    "Kannada film composer",
    "Kannada movies",
    "Kannada songs"
  ],
  Malayalam: [
    "Malayalam film composer",
    "Mollywood music director",
    "Malayalam movies"
  ],
  Bengali: [
    "Bengali music director",
    "Bengali movies"
  ],
  Punjabi: [
    "Punjabi music director",
    "Punjabi movies"
  ],
  Marathi: [
    "Marathi music director",
    "Marathi movies"
  ],
  Gujarati: [
    "Gujarati music director",
    "Gujarati movies"
  ],
};

// PUBLIC_INTERFACE
/**
 * Search for music directors (artists) by language using Spotify search.
 * @param {string} language
 * @param {string} token - Spotify access token
 * @returns {Promise<{artists: Array}|{error: string}>}
 */
export async function searchSpotifyArtistsByLanguage(language, token) {
  try {
    const searchTerms = LANGUAGE_SPOTIFY_KEYWORDS[language] || [language];
    // Compose query to increase chances of South Asian composer/director hits
    // We'll take the first suggestion and search for type=artist, limit 15
    let foundArtists = [];
    for (const keyword of searchTerms) {
      const res = await fetch(
        `${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(keyword)}&type=artist&market=IN&limit=12`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!res.ok) continue; // Try next search if Spotify throttled/errored
      const data = await res.json();
      if (data.artists && Array.isArray(data.artists.items)) {
        foundArtists.push(...data.artists.items);
      }
      // If enough artists found, stop further queries
      if (foundArtists.length >= 10) break;
    }
    // Remove duplicates by ID and artists missing images (UI requirement)
    const uniqueById = {};
    foundArtists.forEach(artist => {
      if (artist.images && artist.images.length > 0) {
        uniqueById[artist.id] = artist;
      }
    });
    let results = Object.values(uniqueById)
      .slice(0, 12)
      .map(a => ({
        id: a.id,
        name: a.name,
        picture: a.images[0]?.url || "",
        genre: (a.genres && a.genres.length) ? a.genres[0] : "",
        // No nb_fan, but support popularity
        popularity: a.popularity
      }));
    if (results.length === 0) throw new Error("No artists found on Spotify for this language.");
    return { artists: results };
  } catch (err) {
    return { error: err.message || "Failed searching Spotify artists." };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch top tracks for a Spotify artist by Spotify artist ID
 * @param {string} artistId
 * @param {string} token
 * @returns {Promise<{tracks: Array}|{error: string}>}
 */
export async function fetchSpotifyTopTracksByArtistId(artistId, token) {
  try {
    // "market=IN" is important for playable preview for Indian tracks
    const res = await fetch(
      `${SPOTIFY_BASE_URL}/artists/${encodeURIComponent(artistId)}/top-tracks?market=IN`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!res.ok) throw new Error("Failed fetching Spotify top tracks.");
    const data = await res.json();
    if (!data.tracks || !Array.isArray(data.tracks) || data.tracks.length === 0)
      throw new Error("No tracks found for artist.");
    return {
      tracks: data.tracks.slice(0, 10).map(track => ({
        id: track.id,
        title: track.name,
        album: track.album?.name || "",
        preview: track.preview_url, // 30s Spotify preview
        artwork: track.album?.images?.[0]?.url || "",
        popularity: track.popularity,
        release_date: track.album?.release_date || "",
        external_url: track.external_urls?.spotify,
      }))
    };
  } catch (err) {
    return { error: err.message || "Failed fetching top tracks from Spotify." };
  }
}
