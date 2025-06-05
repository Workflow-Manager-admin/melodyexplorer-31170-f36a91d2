import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/** --- Color Palette --- */
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

import MUSIC_DIRECTORS from "./musicDirectorsData";
import SpotifyTrackSearch from "./SpotifyTrackSearch";

// PUBLIC_INTERFACE
function DirectorGallery({ directors, selectedDirector, onSelect }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "28px",
      justifyContent: "center",
      margin: "36px 0 18px 0",
    }}>
      {directors.map((director) => (
        <div
          key={director.id}
          onClick={() => onSelect(director)}
          style={{
            cursor: "pointer",
            boxShadow: director.id === selectedDirector?.id
              ? `0 0 0 4px ${COLORS.orangeHighlight}aa`
              : "0 2px 10px #2222",
            background: director.id === selectedDirector?.id
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
            src={director.image}
            alt={director.name}
            style={{
              width: 98,
              height: 98,
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: "0 3px 16px #0002",
              marginBottom: 10,
              border: "2.5px solid #b6e0e0"
            }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: COLORS.slateBlue,
              marginBottom: 6,
              minHeight: 22
            }}>{director.name}</div>
        </div>
      ))}
    </div>
  );
}

function DirectorDetail({ director }) {
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
        {director.name} - Popular Songs
      </div>
      <ul style={{
        listStyle: "none", padding: 0, margin: "0 auto",
        maxWidth: 430, color: COLORS.slateBlue
      }}>
        {director.popularSongs.map((song, i) => (
          <li key={song} style={{
            padding: "6px 0",
            fontSize: 16,
            borderBottom: i !== director.popularSongs.length - 1 ? `1px solid #eaeaea` : "none"
          }}>
            <span role="img" aria-label="note">🎵</span> {song}
          </li>
        ))}
      </ul>
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
  const [selectedDirector, setSelectedDirector] = useState(null);

  useEffect(() => { setSelectedDirector(null); }, [language]);

  if (!language) {
    return (
      <div style={{ textAlign: 'center', color: COLORS.orangeHighlight, fontWeight: 600, padding: 32 }}>
        Language not found.
      </div>
    );
  }

  const directors = MUSIC_DIRECTORS.filter((d) =>
    d.language.map(l => l.toLowerCase()).includes(language.toLowerCase())
  );

  return (
    <>
      <div>
        <div style={{
          textAlign: "center", marginBottom: 8, fontWeight: 600, color: COLORS.tealAccent, fontSize: 21
        }}>
          {directors.length === 0
            ? "No directors available for this language."
            : `Select a Music Director (${language})`}
        </div>
        <DirectorGallery
          directors={directors}
          selectedDirector={selectedDirector}
          onSelect={setSelectedDirector}
        />
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
              Search for more songs by {selectedDirector.name} (Spotify)
            </span>
          </div>
          <SpotifyTrackSearch show accentColor={COLORS.tealAccent} />
        </div>
      )}
    </>
  );
}
