/**
 * WARNING: Do NOT put real Spotify client credentials in frontend code for real deployments.
 * Use only for demos/dev in private. See src/spotifyApi.js for security.
 */

import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Dummy SpotifyTrackSearch component for compatibility
 */
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

// PUBLIC_INTERFACE
function SpotifyTrackSearch({ show, accentColor }) {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [audio, setAudio] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchToken() {
      setError("");
      try {
        // NOTE: Token retrieval is now done securely via the backend proxy endpoint.
        //       This ensures client_id and client_secret are NEVER exposed in frontend code.
        //       Example usage:
        //       const res = await fetch("/getSpotifyToken");
        //       const data = await res.json();
        //       if (data.access_token) setToken(data.access_token);

        const res = await fetch("/getSpotifyToken");
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error_description || data.error || "Error obtaining Spotify token from backend.");
          return;
        }
        if (!data.access_token) {
          setError("No access token returned from backend.");
          return;
        }
        setToken(data.access_token);
      } catch (e) {
        setError(e.message || "Error obtaining Spotify token from backend.");
      }
    }
    fetchToken();
  }, []);

  const handleSearch = async (ev) => {
    ev.preventDefault();
    if (!query.trim() || !token) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=8`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.tracks && data.tracks.items) {
        setResults(data.tracks.items);
      } else {
        setResults([]);
        setError("No results found.");
      }
    } catch (e) {
      setError("Failed to fetch from Spotify.");
    }
    setLoading(false);
  };

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (audio && playingTrackId === track.id) {
      audio.pause();
      setPlayingTrackId(null);
    } else {
      if (audio) audio.pause();
      const newAudio = new window.Audio(track.preview_url);
      setAudio(newAudio);
      setPlayingTrackId(track.id);
      newAudio.play();
      newAudio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audio) audio.pause();
    };
  }, [audio]);

  if (!show) return null;

  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: 600,
        background: COLORS.accent,
        borderRadius: "16px",
        boxShadow: "0 2px 16px #0002",
        padding: "20px 8px 28px 8px"
      }}
    >
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          placeholder="Search songs, albums or artists on Spotify"
          style={{
            padding: "11px 16px",
            borderRadius: 8,
            border: `1.5px solid ${accentColor}`,
            minWidth: 0,
            flex: "1 1 230px",
            fontSize: 16,
            color: COLORS.text,
            outline: "none",
            marginRight: "0"
          }}
        />
        <button
          className="btn"
          type="submit"
          style={{
            background: COLORS.tealAccent,
            color: COLORS.secondary,
            minWidth: 80,
            fontWeight: 500
          }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && (
        <div style={{ color: COLORS.orangeHighlight, marginBottom: 10 }}>{error}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {results.map((track) => (
          <div
            key={track.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f9f9f9",
              boxShadow: "0 1px 5px #bbb3",
              borderRadius: 10,
              padding: "10px 8px",
              gap: 12,
              margin: "2px 0"
            }}
          >
            <img
              src={
                track.album.images[1]?.url ||
                track.album.images[0]?.url ||
                ""
              }
              alt={track.name}
              style={{
                width: 58,
                height: 58,
                borderRadius: 8,
                objectFit: "cover",
                boxShadow: "inset 0 1px 6px #eee9"
              }}
            />
            <div style={{ flex: "1 1 190px" }}>
              <div style={{ fontWeight: 600, color: COLORS.slateBlue }}>
                {track.name}
              </div>
              <div style={{ fontSize: 15, color: "#555" }}>
                {track.artists.map((a) => a.name).join(", ")}
              </div>
              <div style={{ fontSize: 14, color: COLORS.tealAccent }}>
                {track.album.name}
              </div>
            </div>
            <button
              style={{
                background: COLORS.primary,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "10px",
                fontWeight: 500,
                cursor: track.preview_url ? "pointer" : "not-allowed",
                fontSize: 15,
                minWidth: 44,
                marginLeft: 8,
              }}
              onClick={() => handlePlay(track)}
              disabled={!track.preview_url}
              title={
                !track.preview_url
                  ? "Preview not available"
                  : playingTrackId === track.id
                  ? "Pause"
                  : "Play 30s preview"
              }
            >
              {playingTrackId === track.id ? "⏸" : "▶️"}
            </button>
          </div>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{
          color: "#888",
          marginTop: 10,
          textAlign: "center",
          fontSize: 15
        }}>
          <span style={{ color: COLORS.orangeHighlight }}>Tip</span>: Only 30-second preview can be played.<br />
          For full playback, login via Spotify.<br />
        </div>
      )}
    </div>
  );
}

export default SpotifyTrackSearch;
