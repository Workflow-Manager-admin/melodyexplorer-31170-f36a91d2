import React from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import LanguageGrid from "./LanguageGrid";
import DirectorsPage from "./DirectorsPage";

// --- App-wide constants
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
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Punjabi",
  "Marathi",
  "Gujarati",
];

// PUBLIC_INTERFACE
function HeroSection() {
  return (
    <section style={{
      textAlign: "center",
      paddingTop: 48,
      marginBottom: 12
    }}>
      <h1 style={{
        fontSize: 45,
        fontWeight: 700,
        letterSpacing: "2px",
        color: COLORS.slateBlue,
        textShadow: `0 2px 16px ${COLORS.orangeHighlight}22`
      }}>MelodyExplorer</h1>
      <div style={{
        fontSize: 23,
        color: COLORS.orangeHighlight,
        marginBottom: 7,
        fontWeight: 600,
      }}>Discover music by language, director & play tracks with Spotify</div>
      <div style={{
        color: COLORS.text,
        fontSize: 17,
        maxWidth: 680,
        margin: "0 auto",
        padding: "8px 8px 12px 8px"
      }}>
        Select a music language to find legendary music directors.
        <br />Browse their most loved songs and search for any track on Spotify.
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function AppBar() {
  return (
    <nav
      style={{
        width: "100%",
        background: COLORS.slateBlue,
        boxShadow: "0 1px 16px #2129",
        color: COLORS.accent,
        fontWeight: 500,
        zIndex: 10,
        position: "sticky",
        top: 0,
      }}
    >
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        padding: "20px 12px 14px 10px",
        justifyContent: "space-between"
      }}>
        <span style={{
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "2px",
          display: "flex",
          alignItems: "center",
          gap: 13
        }}>
          <span style={{ color: COLORS.primary, fontSize: 34 }}>♫</span>
          MelodyExplorer
        </span>
        <span style={{
          color: COLORS.orangeHighlight,
          fontWeight: 600,
          fontSize: 17
        }}>
          <span role="img" aria-label="record">🎧</span> For Music Lovers
        </span>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function HomeLanguageGrid() {
  const navigate = useNavigate();

  // When language chosen, route to directors page
  function handleLanguageSelect(lang) {
    // Create a URL-safe language string
    const slug = lang.toLowerCase();
    navigate(`/language/${slug}`);
  }

  return (
    <>
      <HeroSection />
      <LanguageGrid
        languages={LANGUAGES}
        onSelect={handleLanguageSelect}
      />
    </>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <div
      className="explorer-bg-music"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.background} 80%, ${COLORS.tealAccent} 100%)`,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Background music notes */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.11,
          backgroundRepeat: "repeat",
          backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                    <text x="6" y="60" font-size="74" fill="${COLORS.tealAccent}">𝄞</text>
                    <text x="80" y="150" font-size="70" fill="${COLORS.primary}">🎵</text>
                    <text x="120" y="98" font-size="62" fill="${COLORS.slateBlue}">♫</text>
                </g>
            </svg>
          `)}')`,
        }}
      ></div>
      <AppBar />
      <main style={{
        maxWidth: 1140,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        paddingBottom: 80,
      }}>
        <Routes>
          <Route path="/" element={<HomeLanguageGrid />} />
          <Route path="/language/:lang" element={<DirectorsPage />} />
        </Routes>
      </main>
      <footer
        style={{
          marginTop: 60,
          padding: "24px 0 18px 0",
          textAlign: "center",
          color: COLORS.slateBlue,
          background: "#fff0",
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: "1.5px",
          zIndex: 3
        }}
      >
        &copy; {new Date().getFullYear()} MelodyExplorer | Built with <span aria-label="music">🎶</span> and <span aria-label="love">💜</span>
      </footer>
    </div>
  );
}

export default App;
