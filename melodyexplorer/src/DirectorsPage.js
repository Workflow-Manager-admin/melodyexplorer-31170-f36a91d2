import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchArtistsByLanguage, fetchTopTracksForArtist } from "./theaudiodbApi";
import SpotifyTrackSearch from "./SpotifyTrackSearch";

/** --- Color Palette --- */
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

/**
 * Gallery of Directors/Artists (TheAudioDB API integration)
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
          key={artist.idArtist}
          onClick={() => onSelect(artist)}
          style={{
            cursor: "pointer",
            boxShadow: artist.idArtist === selectedDirector?.idArtist
              ? `0 0 0 4px ${COLORS.orangeHighlight}aa`
              : "0 2px 10px #2222",
            background: artist.idArtist === selectedDirector?.idArtist
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
            src={artist.strArtistThumb || ""}
            alt={artist.strArtist}
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
            }}>{artist.strArtist}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Show top tracks for selected director/artist using TheAudioDB API.
 */
function DirectorDetail({ director }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!director) return;
    setLoading(true);
    setError("");
    setTracks([]);
    fetchTopTracksForArtist(director.strArtist)
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
  }, [director]);

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
        {director.strArtist} - Top Tracks
      </div>
      {loading && (
        <div style={{ color: COLORS.slateBlue, margin: "12px 0" }}>
          Loading tracks...
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
            <li key={track.idTrack} style={{
              padding: "6px 0",
              fontSize: 16,
              borderBottom: i !== tracks.length - 1 ? `1px solid #eaeaea` : "none"
            }}>
              <span role="img" aria-label="note">🎵</span> {track.strTrack}
              {track.intYearReleased ? (
                <span style={{ color: "#aaa", fontSize: 13 }}> ({track.intYearReleased})</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const languageFromCode = (langCode) =>
  LANGUAGES.find(l => l.toLowerCase() === langCode.toLowerCase());

/**
 * PUBLIC_INTERFACE
 * Route for "/language/:lang"
 */
export default function DirectorsPage() {
  const { lang } = useParams();
  const language = languageFromCode(lang);

  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDirector, setSelectedDirector] = useState(null);

  useEffect(() => {
    if (!language) return;
    setDirectors([]);
    setSelectedDirector(null);
    setLoading(true);
    setError("");
    fetchArtistsByLanguage(language)
      .then(result => {
        if (result.error) {
          setError(result.error);
          setDirectors([]);
        } else {
          setDirectors(result.artists);
        }
        setLoading(false);
      });
  }, [language]);

  if (!language) {
    return (
      <div style={{ textAlign: 'center', color: COLORS.orangeHighlight, fontWeight: 600, padding: 32 }}>
        Language not found.
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
            ? "Loading directors..."
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
      {selectedDirector && (
        <DirectorDetail director={selectedDirector} />
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
              Search for more songs by {selectedDirector.strArtist} (Spotify)
            </span>
          </div>
          <SpotifyTrackSearch show accentColor={COLORS.tealAccent} />
        </div>
      )}
    </>
  );
}
