import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSpotifyAccessToken, searchSpotifyArtistsByLanguage, fetchSpotifyTopTracksByArtistId } from "./spotifyApi";
import SpotifyTrackSearch from "./SpotifyTrackSearch";

const COLORS = {
  primary: "#eca7d6",
  secondary: "#191414",
  accent: "#fffafe",
  background: "#F5F5F5",
  tealAccent: "#88BDBC",
  slateBlue: "#254E58",
  text: "#333333",
  orangeHighlight: "#F28F3B",
};

const LANGUAGES = [
  "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Punjabi", "Marathi", "Gujarati"
];

const API_SOURCE = "spotify"; // Spotify as the API source

// PUBLIC_INTERFACE
/**
 * Gallery of Directors/Artists (Spotify API integration)
 */
function DirectorGallery({ directors, selectedDirector, onSelect }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "28px",
      justifyContent: "center",
      margin: "36px 0 18px 0",
    }}>
      {directors.map((artist) => (
        <div
          key={artist.id}
          onClick={() => onSelect(artist)}
          style={{
            cursor: "pointer",
            boxShadow: artist.id === selectedDirector?.id
              ? `0 0 0 4px ${COLORS.orangeHighlight}aa`
              : "0 2px 10px #2222",
            background: artist.id === selectedDirector?.id
              ? COLORS.tealAccent
              : COLORS.accent,
            borderRadius: 18,
            width: 165,
            padding: "16px 8px 12px 8px",
            textAlign: "center",
            transition: "box-shadow 0.2s, background 0.2s",
            border: "1.5px solid #dedede",
          }}
        >
          <img
            src={artist.picture || ""}
            alt={artist.name}
            style={{
              width: 98,
              height: 98,
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: "0 3px 16px #0002",
              marginBottom: 10,
              border: "2.5px solid #b6e0e0"
            }}
            onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/98x98?text=No+Image"; }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: COLORS.slateBlue,
              marginBottom: 6,
              minHeight: 22
            }}>{artist.name}</div>
          <div style={{ color: "#888", fontSize: 13 }}>
            {artist.genre
              ? <span>{artist.genre}</span>
              : typeof artist.popularity === "number"
              ? <span>★ Popularity: {artist.popularity}</span>
              : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Show top tracks for selected director/artist with Spotify API.
 */
function DirectorDetail({ director, token }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!director) return;
    setLoading(true);
    setError("");
    setTracks([]);
    fetchSpotifyTopTracksByArtistId(director.id, token)
      .then(result => {
        if (!isMounted) return;
        if (result.error) {
          setError(result.error);
          setTracks([]);
        } else {
          setTracks(result.tracks);
        }
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, [director, token]);

  if (!director) return null;

  return (
    <div style={{
      marginTop: 16,
      marginBottom: 20,
      textAlign: "center",
      paddingBottom: 12
    }}>
      <div style={{
        fontSize: 20, fontWeight: 600, color: COLORS.primary, marginBottom: 6
      }}>
        {director.name} - Top Tracks (Spotify)
      </div>
      {loading && (
        <div style={{ color: COLORS.slateBlue, margin: "12px 0" }}>
          Loading tracks from Spotify...
        </div>
      )}
      {error && (
        <div style={{ color: COLORS.orangeHighlight, marginBottom: 5 }}>
          {error}
        </div>
      )}
      {!loading && !error && tracks && (
        <ul style={{
          listStyle: "none", padding: 0, margin: "0 auto",
          maxWidth: 430, color: COLORS.slateBlue
        }}>
          {tracks.map((track, i) => (
            <li key={track.id} style={{
              padding: "6px 0",
              fontSize: 16,
              borderBottom: i !== tracks.length - 1 ? `1px solid #eaeaea` : "none",
              display: "flex",
              alignItems: "center",
              gap: 7,
              minHeight: 38
            }}>
              {track.artwork && (
                <img
                  src={track.artwork}
                  alt={track.title}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 4,
                    marginRight: 7,
                    verticalAlign: "middle",
                    objectFit: "cover",
                    boxShadow: "0 1px 4px #ddd"
                  }}
                  onError={e => { e.target.onerror = null; e.target.style.display = "none"; }}
                />
              )}
              <span role="img" aria-label="note">🎵</span> {track.title}
              {track.album && (
                <span style={{ color: "#bbb", fontSize: 13 }}> &ndash; {track.album}</span>
              )}
              <a
                href={track.external_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 7, color: COLORS.tealAccent, fontSize: 15, textDecoration: "underline" }}
                title="Open in Spotify">
                  Open
              </a>
              {/* Render audio preview if available */}
              {track.preview ? (
                <audio
                  src={track.preview}
                  controls
                  style={{ verticalAlign: "middle", marginLeft: 9, height: 23 }}
                  preload="none"
                >
                  Your browser does not support audio.
                </audio>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && tracks && tracks.length === 0 && (
        <div style={{ color: COLORS.orangeHighlight, marginTop: 8 }}>
          No tracks found.
        </div>
      )}
    </div>
  );
}

const languageFromCode = (langCode) =>
  LANGUAGES.find(l => l.toLowerCase() === langCode.toLowerCase());

/**
 * PUBLIC_INTERFACE
 * Route for "/language/:lang"
 * Integrates Spotify Web API for dynamic music director and track fetching
 */
export default function DirectorsPage() {
  const { lang } = useParams();
  const language = languageFromCode(lang);

  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");

  // Get a Spotify token on mount or when language changes
  useEffect(() => {
    let isMounted = true;
    setToken("");
    setTokenError("");
    getSpotifyAccessToken().then(res => {
      if (!isMounted) return;
      if (res.error) setTokenError(res.error);
      else setToken(res.access_token);
    });
    return () => { isMounted = false; };
  }, [language]);

  useEffect(() => {
    if (!language || typeof language !== "string" || !language.trim()) {
      setError("Invalid or empty language selected.");
      setDirectors([]);
      setLoading(false);
      setSelectedDirector(null);
      return;
    }
    if (!token) {
      // Wait for token
      setError("");
      setDirectors([]);
      setLoading(true);
      setSelectedDirector(null);
      return;
    }
    setDirectors([]);
    setSelectedDirector(null);
    setLoading(true);
    setError("");
    searchSpotifyArtistsByLanguage(language, token)
      .then(result => {
        if (result.error) {
          setError(result.error);
          setDirectors([]);
        } else if (!result.artists || !Array.isArray(result.artists) || result.artists.length === 0) {
          setError("No artists found for this language.");
          setDirectors([]);
        } else {
          setDirectors(result.artists);
        }
        setLoading(false);
      });
  }, [language, token]);

  if (!language) {
    return (
      <div style={{ textAlign: 'center', color: COLORS.orangeHighlight, fontWeight: 600, padding: 32 }}>
        Language not found.
      </div>
    );
  }
  if (tokenError) {
    return (
      <div style={{ textAlign: 'center', color: COLORS.orangeHighlight, fontWeight: 600, padding: 32 }}>
        Spotify authentication failed: {tokenError}
      </div>
    );
  }

  return (
    <>
      <div>
        <div style={{
          textAlign: "center", marginBottom: 8, fontWeight: 600, color: COLORS.tealAccent, fontSize: 21
        }}>
          {loading
            ? `Loading directors (Spotify)...`
            : error
              ? `Error: ${error}`
              : (directors.length === 0
                ? "No directors available for this language."
                : `Select a Music Director (${language})`)}
        </div>
        {!loading && !error && (
          <DirectorGallery
            directors={directors}
            selectedDirector={selectedDirector}
            onSelect={setSelectedDirector}
          />
        )}
      </div>
      {selectedDirector && token && (
        <DirectorDetail director={selectedDirector} token={token} />
      )}
      {selectedDirector && (
        <div style={{
          margin: "0 auto",
          maxWidth: 680,
          marginTop: 24,
          background: "#fff6",
          borderRadius: 18,
          boxShadow: "0 2px 4px #0001"
        }}>
          <div style={{
            textAlign: "center",
            color: COLORS.slateBlue,
            fontWeight: 600,
            fontSize: 18,
            margin: "13px 8px 0 8px",
          }}>
            <span style={{ color: COLORS.tealAccent }}>
              Search for more songs by {selectedDirector.name} (Spotify)
            </span>
          </div>
          <SpotifyTrackSearch show accentColor={COLORS.tealAccent} />
        </div>
      )}
    </>
  );
}
