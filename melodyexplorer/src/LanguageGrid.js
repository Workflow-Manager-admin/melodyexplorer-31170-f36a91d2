import React from "react";

/**
 * PUBLIC_INTERFACE
 * LanguageGrid renders available languages in a 3x3 column grid.
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

const LANGUAGE_INITIALS = {
  "Hindi": "अ",
  "Tamil": "அ",
  "Telugu": "అ",
  "Kannada": "ಅ",
  "Malayalam": "അ",
  "Bengali": "অ",
  "Punjabi": "ਅ",
  "Marathi": "अ",
  "Gujarati": "અ",
};

// PUBLIC_INTERFACE
function LanguageGrid({ languages, onSelect }) {
  const numCols = 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, minmax(150px, 1fr))`,
        gap: "28px",
        background: "#ffffffcc",
        borderRadius: 18,
        margin: "36px 0 36px 0",
        boxShadow: "0 2px 10px #0001",
        padding: "28px 28px"
      }}
    >
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className="lang-btn"
          style={{
            background: COLORS.tealAccent,
            color: COLORS.text,
            padding: "30px 0",
            margin: "0",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            width: "100%",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "1.5px",
            transition: "background 0.18s, color 0.18s"
          }}
          aria-current={undefined}
          tabIndex={0}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: COLORS.slateBlue,
              display: "block",
              marginBottom: 10
            }}
          >
            {LANGUAGE_INITIALS[lang] || lang[0]}
          </span>
          {lang}
        </button>
      ))}
    </div>
  );
}

export default LanguageGrid;
