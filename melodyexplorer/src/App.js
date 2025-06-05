import React, { useState, useEffect } from "react";
import "./App.css";

// --- Configuration Data ---

// Color palette for inline styles and CSS variables
const COLORS = {
  primary: "#eca7d6",          // not in the defaults, use for accents
  secondary: "#191414",        // black, Spotify
  accent: "#fffafe",           // for light panel backgrounds etc
  background: "#F5F5F5",
  tealAccent: "#88BDBC",
  slateBlue: "#254E58",
  text: "#333333",
  orangeHighlight: "#F28F3B",
};

/**
 * Expanded language and music director dataset for a richer MelodyExplorer.
 */

// Expanded language list (9 for 3x3 grid)
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

// Expanded, richer director data, 4-5 per language, 4-6 songs each
const MUSIC_DIRECTORS = [
  // HINDI
  {
    id: 101,
    name: "R.D. Burman",
    language: ["Hindi", "Bengali"],
    image: "https://upload.wikimedia.org/wikipedia/commons/5/59/R._D._Burman_%28cropped%29.jpg",
    popularSongs: [
      "Mehbooba Mehbooba",
      "Dum Maro Dum",
      "Chura Liya Hai Tumne",
      "Yeh Shaam Mastani",
      "Piya Tu Ab To Aaja",
      "Humein Tumse Pyaar Kitna"
    ],
  },
  {
    id: 102,
    name: "Shankar–Jaikishan",
    language: ["Hindi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Shankar-Jaikishan.jpg",
    popularSongs: [
      "Awara Hoon",
      "Mera Joota Hai Japani",
      "Zindagi Ek Safar",
      "Jeena Yahan Marna Yahan",
      "Buddha Mil Gaya"
    ],
  },
  {
    id: 103,
    name: "Laxmikant–Pyarelal",
    language: ["Hindi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Laxmikant_Pyarelal.jpg",
    popularSongs: [
      "Dafli Wale Dafli Baja",
      "My Name Is Lakhan",
      "Om Shanti Om",
      "Ek Do Teen",
      "Yeh Galiyan Yeh Chaubara"
    ],
  },
  {
    id: 104,
    name: "A.R. Rahman",
    language: ["Tamil", "Hindi", "Telugu"],
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/A.R._Rahman_%282016%29.jpg",
    popularSongs: [
      "Jai Ho",
      "Vande Mataram",
      "Kun Faya Kun",
      "Chaiyya Chaiyya",
      "Roja Jaaneman",
      "Dil Se Re"
    ],
  },
  {
    id: 105,
    name: "Pritam",
    language: ["Hindi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Pritam_at_Hum_Chaar_music_album_launch.jpg",
    popularSongs: [
      "Tum Mile",
      "Ae Dil Hai Mushkil",
      "Subhanallah",
      "Phir Le Aaya Dil",
      "Badtameez Dil"
    ]
  },

  // TAMIL
  {
    id: 201,
    name: "Ilaiyaraaja",
    language: ["Tamil", "Telugu", "Kannada", "Malayalam"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Ilaiyaraaja_TIFF.jpg/440px-Ilaiyaraaja_TIFF.jpg",
    popularSongs: [
      "Anjali Anjali",
      "Nilaave Vaa",
      "Janani Janani",
      "Thendral Vandhu",
      "Rakkamma",
      "Thenpandi Cheemayile"
    ],
  },
  {
    id: 202,
    name: "M. S. Viswanathan",
    language: ["Tamil", "Malayalam", "Telugu"],
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/M._S._Viswanathan.jpg",
    popularSongs: [
      "Sippi Irukkudu",
      "Raasaathi Unna",
      "Yedho Ninaivugal",
      "En Iniya Pon Nilave",
      "Kurukku Siruthavale"
    ],
  },
  {
    id: 203,
    name: "Harris Jayaraj",
    language: ["Tamil", "Telugu"],
    image: "https://upload.wikimedia.org/wikipedia/commons/6/65/Harris_Jayaraj.jpg",
    popularSongs: [
      "Vaseegara",
      "Oru Maalai",
      "Anbil Avan",
      "June Ponal",
      "Suttum Vizhi"
    ]
  },
  {
    id: 204,
    name: "Anirudh Ravichander",
    language: ["Tamil", "Telugu", "Hindi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Anirudh_Ravichander_-_Live_Concert_%28cropped%29.jpg",
    popularSongs: [
      "Why This Kolaveri Di",
      "Vathi Coming",
      "Hukum",
      "Don'u Don'u Don'u",
      "Cheliya",
      "Selfie Pulla"
    ],
  },

  // TELUGU
  {
    id: 301,
    name: "Keeravani",
    language: ["Telugu", "Hindi", "Tamil"],
    image: "https://upload.wikimedia.org/wikipedia/commons/6/69/M.M._Keeravani.jpg",
    popularSongs: [
      "Dheera Dheera",
      "Ninnu Kori Varnam",
      "Laaga Laaga",
      "Kalusukovalani",
      "Naatu Naatu"
    ]
  },
  {
    id: 302,
    name: "Mani Sharma",
    language: ["Telugu"],
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Mani_Sharma_at_Khelo_India_University_Games_2020.jpg",
    popularSongs: [
      "Vennelave",
      "Chinuku Taake",
      "Choododde",
      "Ammayi Kitikilo",
      "Raa Raa",
      "Ringa Ringa"
    ]
  },
  {
    id: 303,
    name: "Devi Sri Prasad",
    language: ["Telugu", "Tamil", "Kannada"],
    image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Devi_Sri_Prasad_2014.jpg",
    popularSongs: [
      "Ringa Ringa",
      "Daddy Mummy",
      "Seeti Maar",
      "Butta Bomma",
      "Srivalli"
    ]
  },
  {
    id: 304,
    name: "Mickey J Meyer",
    language: ["Telugu"],
    image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Mickey_J_Meyer.jpg",
    popularSongs: [
      "Asha Pasham",
      "Yevanda",
      "Chinni Chinni",
      "O Range",
      "Vintunnava"
    ]
  },

  // KANNADA
  {
    id: 401,
    name: "Hamsalekha",
    language: ["Kannada"],
    image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Hamsalekha.jpg",
    popularSongs: [
      "Nodamma Hudugi",
      "Nadamaya",
      "Krishna Nee Begane Baro",
      "Prema Baraha",
      "Jotheyali Jothe Jotheyali",
      "Tunturu Alli Neera Haadu"
    ],
  },
  {
    id: 402,
    name: "V. Harikrishna",
    language: ["Kannada"],
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/V._Harikrishna.jpg",
    popularSongs: [
      "Bombe Aadsonu",
      "Sooju Sundaraga",
      "Kanasina Mareyada",
      "Bul Bul",
      "Chalisuva Cheluve"
    ]
  },
  {
    id: 403,
    name: "G. K. Venkatesh",
    language: ["Kannada"],
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/G.K._Venkatesh.jpg",
    popularSongs: [
      "Haadu Haleyadaru",
      "Beladingalagi Baa",
      "Nanna Hesaru",
      "Ee Bhoomi Bannada Buguri"
    ]
  },
  {
    id: 404,
    name: "Arjun Janya",
    language: ["Kannada"],
    image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Arjun_Janya.jpg",
    popularSongs: [
      "Saahore Saaho",
      "Jai Hanuman",
      "Raja Raja Kichcha",
      "Hale Haadu Hale Nenapu"
    ]
  },

  // MALAYALAM
  {
    id: 501,
    name: "M. G. Radhakrishnan",
    language: ["Malayalam"],
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/M._G._Radhakrishnan.jpg",
    popularSongs: [
      "Madhuram Jeevamruthabindu",
      "Unarumee Gaanam",
      "Pramadhavanam Veendum",
      "Vaathilil Aa Vaathilil",
      "Entammede Jimikki Kammal"
    ]
  },
  {
    id: 502,
    name: "Johnson",
    language: ["Malayalam"],
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Johnson_Devassy_%28Malayalam_music_director%29.jpg",
    popularSongs: [
      "Thoovaanam Poyilum",
      "Doore Kizhakkudikkum",
      "Pathiravayi Neram",
      "Shyaama Meghame"
    ]
  },
  {
    id: 503,
    name: "Jerry Amaldev",
    language: ["Malayalam"],
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Jerry_Amaldev.jpg",
    popularSongs: [
      "Aayiram Kannumayi",
      "Mizhiyoram",
      "Ilaneer Poovukal",
      "Maanasaavin"
    ]
  },
  {
    id: 504,
    name: "G. Devarajan",
    language: ["Malayalam"],
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/G_Devarajan.jpg",
    popularSongs: [
      "Manasa Maine Varu",
      "Swapnangal Swapnangale",
      "Chethi Mandaram Thulasi",
      "Sharike Sharike"
    ]
  },

  // BENGALI
  {
    id: 601,
    name: "Salil Chowdhury",
    language: ["Hindi", "Bengali", "Malayalam"],
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/SalilChowdhuryPic.jpg",
    popularSongs: [
      "Itna Na Mujhse Tu Pyar Badha",
      "O Sajna Barkha Bahar Aayi",
      "Chhoti Si Baat",
      "Gaganer Thale",
      "Ei Raat Tomar Amar"
    ],
  },
  {
    id: 602,
    name: "Rajatava Dutta",
    language: ["Bengali"],
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Rajatava_Dutta_Bengali_Movie_Music_Director.jpg",
    popularSongs: [
      "Tumi Jake Bhalobasho",
      "Basanta Ese Geche",
      "Tomar Kachhe",
      "Gaan Amar"
    ]
  },
  {
    id: 603,
    name: "Jeet Gannguli",
    language: ["Bengali"],
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Jeet_Gannguli_Bengali_Music_Director.jpg",
    popularSongs: [
      "Mon Majhi Re",
      "Egiye De",
      "Shudhu Tomari Jonno",
      "Bojhena Shey Bojhena"
    ]
  },

  // PUNJABI
  {
    id: 701,
    name: "Yo Yo Honey Singh",
    language: ["Punjabi", "Hindi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Honey_Singh_2018.jpg",
    popularSongs: [
      "Angreji Beat",
      "Lungi Dance",
      "High Heels",
      "Desi Kalakaar",
      "Blue Eyes"
    ]
  },
  {
    id: 702,
    name: "B Praak",
    language: ["Punjabi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/B_Praak_in_2019.jpg",
    popularSongs: [
      "Filhall",
      "Mann Bharrya",
      "Teri Mitti",
      "Kuch Bhi Ho Jaye"
    ]
  },
  {
    id: 703,
    name: "Jatinder Shah",
    language: ["Punjabi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Jatinder_Shah.jpg",
    popularSongs: [
      "Mitti",
      "Ki Banu Duniya Da",
      "Pani Di Gal",
      "Kanda Kacheya Ne"
    ]
  },

  // MARATHI
  {
    id: 801,
    name: "Ajay-Atul",
    language: ["Marathi", "Hindi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Ajay-Atul.jpg",
    popularSongs: [
      "Jeev Rangla",
      "Morya Morya",
      "Apsara Aali",
      "Mauli Mauli",
      "Zingaat"
    ]
  },
  {
    id: 802,
    name: "Hridaynath Mangeshkar",
    language: ["Marathi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/3/31/Hridaynath_Mangeshkar.jpg",
    popularSongs: [
      "Mogara Phulala",
      "Gharoba",
      "Mee Raat Takli",
      "Amrutahuni God"
    ]
  },
  {
    id: 803,
    name: "Shankar Mahadevan",
    language: ["Marathi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/7/76/Shankar_Mahadevan_pictur%28cropped%29.jpg",
    popularSongs: [
      "Shivba Raja",
      "Rama Rama",
      "Dil Dhadakne Do",
      "Gaganala Ha Waata"
    ]
  },

  // GUJARATI
  {
    id: 901,
    name: "Avinash Vyas",
    language: ["Gujarati"],
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Avinash_Vyas_Gujarati_Music.jpg",
    popularSongs: [
      "Taro Maro Saath Chhe",
      "Halo Re Halo",
      "Chhalne Aankho",
      "Moti Veraana Chokma"
    ]
  },
  {
    id: 902,
    name: "Mehul Surti",
    language: ["Gujarati"],
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mehul_Surti_2018.jpg",
    popularSongs: [
      "Meharbani",
      "Nayana Lai Ne",
      "Prem No Rang",
      "Gori Radha Ne Kado Kan"
    ]
  },
  {
    id: 903,
    name: "Kedar Upadhyay",
    language: ["Gujarati"],
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Kedar_Upadhyay_Gujarati_MD.jpg",
    popularSongs: [
      "Gori Radha",
      "Chor Bani Thangaat Kare",
      "Chhel Chhabilo",
      "Aavo Mari Sathe"
    ]
  },
];

// --- Helper functions ---

function groupLanguagesByFirstLetter(langs) {
  // Returns: Array of {letter, langs: Array}
  const groups = {};
  langs.forEach((lang) => {
    const l = lang[0].toUpperCase();
    if (!groups[l]) groups[l] = [];
    groups[l].push(lang);
  });
  // Return sorted by letter
  return Object.entries(groups)
    .sort(([la,], [lb,]) => la.localeCompare(lb))
    .map(([letter, langs]) => ({ letter, langs }));
}

// --- Components ---

// PUBLIC_INTERFACE
function LanguageGrid({ languages, selected, onSelect }) {
  /**
   * Display languages in columns grouped by first letter. 
   * PUBLIC_INTERFACE
   */
  const groups = groupLanguagesByFirstLetter(languages);

  return (
    <div style={{
      display: "flex",
      gap: "32px",
      justifyContent: "center",
      background: "#ffffffaa",
      borderRadius: 16,
      margin: "32px 0",
      boxShadow: "0 2px 8px #0001",
      padding: "20px 24px"
    }}>
      {groups.map((group) => (
        <div key={group.letter}>
          <div style={{
            fontWeight: 700,
            fontSize: 20,
            color: COLORS.slateBlue,
            letterSpacing: "2px",
            marginBottom: 6,
            textAlign: "center"
          }}>{group.letter}</div>
          {group.langs.map((lang) => (
            <button
              key={lang}
              onClick={() => onSelect(lang)}
              className="lang-btn"
              style={{
                background: selected === lang ? COLORS.slateBlue : COLORS.tealAccent,
                color: selected === lang ? COLORS.accent : COLORS.text,
                padding: "8px 14px",
                margin: "5px auto",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                display: "block",
                minWidth: 80,
                fontSize: 15,
                fontWeight: 500,
                boxShadow: selected === lang ? `0 2px 4px ${COLORS.slateBlue}55` : undefined,
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function DirectorGallery({ directors, selectedDirector, onSelect }) {
  /**
   * Show a flex gallery of director images with name, highlight on select.
   * PUBLIC_INTERFACE
   */
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

// PUBLIC_INTERFACE
function DirectorDetail({ director }) {
  /**
   * Shows a list of director's popular songs.
   * PUBLIC_INTERFACE
   */
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

// PUBLIC_INTERFACE
function SpotifyTrackSearch({ show, accentColor }) {
  /**
   * Track search bar with results and (short preview) playback, via Spotify public search API.
   * PUBLIC_INTERFACE
   */
  // Spotify client id/secret would need to be set up with a proxy or using implicit grant.
  // For demo, we'll use "client credentials" grant via a public endpoint for testing/demo only (no user login/playback!), and play previews only.
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [audio, setAudio] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get Spotify token, store it in state
  useEffect(() => {
    // NOTE: For a real app, move this to backend. Using public demo client.
    async function fetchToken() {
      setError("");
      try {
        const res = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                btoa("6b9da695e18f407f84c4f5da8431ee24:4e406d263f464516bb24925c54eb14d6"),
            },
            body: "grant_type=client_credentials",
          }
        );
        const data = await res.json();
        setToken(data.access_token);
      } catch (e) {
        setError("Error obtaining Spotify token.");
      }
    }
    fetchToken();
    // Token usually valid for 1 hour.
  }, []);

  // Handle search
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

  // Playback controls - preview_url only!
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
          placeholder="Search songs, albums or artists on Spotify (try 'Chaiyya' or 'Vande Mataram')"
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

// PUBLIC_INTERFACE
function MelodyExplorerContainer() {
  /**
   * Main container that holds the state and orchestrates flow between language grid,
   * director gallery, details, and Spotify search.
   * PUBLIC_INTERFACE
   */
  // State for selected language
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  // State for selected director
  const [selectedDirector, setSelectedDirector] = useState(null);

  // Directors for the selected language
  const directors = MUSIC_DIRECTORS.filter((d) =>
    d.language.includes(selectedLanguage)
  );

  // When selectedLanguage changes, reset selectedDirector
  useEffect(() => {
    setSelectedDirector(null);
  }, [selectedLanguage]);

  // Immersive music-themed background (musical notes SVG as background)
  return (
    <div
      className="explorer-bg-music"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.background} 80%, ${COLORS.tealAccent} 100%)`,
        position: "relative",
        // 'overlay' SVG in a low opacity, extra dreamy
        overflowX: "hidden"
      }}
    >
      {/* Music notes SVG Overlay */}
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
      {/* AppBar */}
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

      <main style={{
        maxWidth: 1140,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        paddingBottom: 80,
      }}>
        {/* Hero */}
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
          }}>Discover music by language, director &amp; play tracks with Spotify</div>
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
        {/* Language selection grid */}
        <LanguageGrid
          languages={LANGUAGES}
          selected={selectedLanguage}
          onSelect={setSelectedLanguage}
        />
        {/* Director gallery */}
        <div>
          <div style={{
            textAlign: "center", marginBottom: 8, fontWeight: 600, color: COLORS.tealAccent, fontSize: 21
          }}>
            {directors.length === 0
              ? "No directors available for this language."
              : "Select a Music Director"}
          </div>
          <DirectorGallery
            directors={directors}
            selectedDirector={selectedDirector}
            onSelect={setSelectedDirector}
          />
        </div>
        {/* Director popular songs */}
        {selectedDirector && (
          <DirectorDetail director={selectedDirector} />
        )}
        {/* Spotify track search - only if a director is selected */}
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
      </main>
      {/* Footer */}
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

// --- Main App Export ---

// PUBLIC_INTERFACE
function App() {
  /** Replace template with MelodyExplorerContainer. */
  return <MelodyExplorerContainer />;
}

export default App;
