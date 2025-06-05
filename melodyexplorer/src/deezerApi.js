//
// Helper functions for interacting with Deezer API
//
// See: https://developers.deezer.com/api

const DEEZER_BASE_URL = "https://api.deezer.com";

// PUBLIC_INTERFACE
/**
 * Search for artists (directors) by keyword.
 * Deezer API allows searching by artist name (no direct language field).
 * We'll search by language as keyword, and filter results accordingly if needed.
 * @param {string} language - Language to search for (e.g. "Hindi").
 * @returns {Promise<{artists: Array}|{error: string}>}
 */
export async function searchArtistsByLanguage(language) {
  try {
    // Use Deezer's /search/artist?q=language
    const res = await fetch(
      `https://corsproxy.io/?${encodeURIComponent(DEEZER_BASE_URL + "/search/artist?q=" + encodeURIComponent(language))}`
    );
    if (!res.ok) throw new Error("Failed to fetch artists from Deezer.");
    const data = await res.json();
    if (!data.data) throw new Error("No artists found.");
    // Only keep relevant fields (id, name, picture)
    return {
      artists: data.data
        .map(a => ({
          id: a.id,
          name: a.name,
          picture: a.picture_medium || a.picture || "",
          nb_fan: a.nb_fan
        }))
        // Filter obvious non-artist results (best effort, Deezer results can be broad)
        .filter(a => !!a.picture)
        .slice(0, 15),
    };
  } catch (err) {
    return { error: err.message || "Failed to fetch from Deezer." };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch top tracks for an artist by Deezer artist ID.
 * @param {number|string} artistId - Deezer Artist ID
 * @returns {Promise<{tracks: Array}|{error: string}>}
 */
export async function fetchTopTracksByArtistId(artistId) {
  try {
    const res = await fetch(
      `https://corsproxy.io/?${encodeURIComponent(DEEZER_BASE_URL + `/artist/${artistId}/top?limit=10`)}`
    );
    if (!res.ok) throw new Error("Failed to fetch top tracks for artist.");
    const data = await res.json();
    if (!data.data) throw new Error("No tracks found.");
    return {
      tracks: data.data.map(t => ({
        id: t.id,
        title: t.title,
        album: t.album ? t.album.title : "",
        preview: t.preview,
        duration: t.duration,
        release_date: t.release_date,
      })),
    };
  } catch (err) {
    return { error: err.message || "Failed to fetch top tracks from Deezer." };
  }
}
