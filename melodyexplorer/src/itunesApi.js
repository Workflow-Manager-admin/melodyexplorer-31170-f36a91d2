//
// Helper functions for interacting with the iTunes Search API
// See: https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
//
// The iTunes Search API does not require authentication and has CORS enabled
// 

const ITUNES_BASE_URL = "https://itunes.apple.com";

// PUBLIC_INTERFACE
/**
 * Search for artists (music directors) by name or keyword (could be a language string).
 * @param {string} term - Search term (artist name, language, etc.)
 * @returns {Promise<{artists: Array}|{error: string}>}
 */
export async function searchArtists(term) {
  // Restrict search to 'music' entity and only artists
  try {
    const url = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(term)}&entity=musicArtist&limit=15`;
    if (process.env.NODE_ENV === "development") {
      console.log("[iTunesAPI] Searching artists: ", url);
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch from iTunes.");
    const data = await res.json();
    if (process.env.NODE_ENV === "development") {
      console.log("[iTunesAPI] Artist search response:", data);
    }

    if (!data.results || data.results.length === 0) throw new Error("No artists found.");
    // Map to unified artist structure for gallery display
    return {
      artists: data.results.map(a => ({
        id: a.artistId,
        name: a.artistName,
        // artworkUrl100 only present for some queries. Fallback to using empty string if missing
        picture: a.artworkUrl100 ? a.artworkUrl100.replace('100x100bb', '200x200bb') : "",
        genre: a.primaryGenreName,
        // No nb_fan equivalent
      }))
    };
  } catch (err) {
    return { error: err.message || "iTunes artist search failed." };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch top tracks (songs) for an artist by iTunes artistId.
 * @param {number|string} artistId
 * @returns {Promise<{tracks: Array}|{error: string}>}
 */
export async function fetchTopTracksByArtistId(artistId) {
  // Use /lookup?id=ARTIST_ID&entity=song for top tracks
  try {
    // Return 10 most popular tracks (by order in iTunes API)
    const url = `${ITUNES_BASE_URL}/lookup?id=${artistId}&entity=song&limit=10`;
    if (process.env.NODE_ENV === "development") {
      console.log("[iTunesAPI] Fetching tracks for artist: ", url);
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch tracks from iTunes.");
    const data = await res.json();
    if (process.env.NODE_ENV === "development") {
      console.log("[iTunesAPI] Tracks fetch response:", data);
    }
    // Tracks are in .results (first element is artist, rest are tracks)
    if (!data.results || data.results.length <= 1) throw new Error("No tracks found.");
    // Remove first element (artist itself)
    const tracks = data.results.slice(1).map(t => ({
      id: t.trackId,
      title: t.trackName,
      album: t.collectionName,
      preview: t.previewUrl,
      artwork: t.artworkUrl100 ? t.artworkUrl100.replace('100x100bb', '200x200bb') : "",
      releaseDate: t.releaseDate,
    }));
    return { tracks };
  } catch (err) {
    return { error: err.message || "Failed to fetch iTunes tracks." };
  }
}
