//
// Helper functions for interacting with TheAudioDB API
//
const BASE_URL = "https://www.theaudiodb.com/api/v1/json/2";

// PUBLIC_INTERFACE
/**
 * Fetch a list of artists matching a language or genre.
 * @param {string} language - The language or genre to search for.
 * @returns {Promise<{artists: Array}|{error: string}>}
 */
export async function fetchArtistsByLanguage(language) {
  // TheAudioDB is mostly genre driven – map language to a likely genre.
  // (Hindi, Tamil, etc. will fallback to "Indian", or fetch all artists for Fallback)
  const genreMap = {
    Hindi: "Indian",
    Tamil: "Indian",
    Telugu: "Indian",
    Kannada: "Indian",
    Malayalam: "Indian",
    Bengali: "Indian",
    Punjabi: "Indian",
    Marathi: "Indian",
    Gujarati: "Indian",
  };
  const genre = genreMap[language] || language;

  try {
    // Get artists by genre: /search.php?g=Indian
    const url = `${BASE_URL}/search.php?g=${encodeURIComponent(genre)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    if (!data.artists) throw new Error("No artists found.");
    // Only return required fields (and limit to 15 results for gallery)
    return {
      artists: data.artists
        .filter(a => !!a.strArtistThumb) // Only keep those with image
        .slice(0, 15),
    };
  } catch (err) {
    return { error: err.message || "Failed to fetch artists." };
  }
}

/**
 * Fetch the top tracks for an artist by name.
 * @param {string} artistName
 * @returns {Promise<{tracks: Array}|{error: string}>}
 */
export async function fetchTopTracksForArtist(artistName) {
  try {
    // /track-top10.php?s=AR%20Rahman
    const url = `${BASE_URL}/track-top10.php?s=${encodeURIComponent(artistName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error fetching tracks");
    const data = await res.json();
    if (!data.track) throw new Error("No tracks found for artist.");
    // Return only the top 10 tracks
    return {
      tracks: data.track.filter(t => t.strTrack).slice(0, 10),
    };
  } catch (err) {
    return { error: err.message || "Failed to fetch tracks." };
  }
}
