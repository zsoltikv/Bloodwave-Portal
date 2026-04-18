import huWordsRaw from "../../locales/hu.txt?raw";
import enWordsRaw from "../../locales/en.txt?raw";

// the following flag prevents re-processing the lists multiple times
let _loaded = false;

// this set holds the normalized banned tokens collected from locale files
const _banned = new Set();

// addWordsFromText: parse raw newline-separated text and add cleaned tokens
// - input: raw text from a locale file (string)
// - behavior: splits on newlines, trims, normalizes unicode, lowercases,
//   and ignores blank lines or comment lines starting with '#' or '//'.
function addWordsFromText(text) {
  text.split(/\r?\n/).forEach((line) => {
    const word = line.trim().toLowerCase().normalize("NFC");
    if (!word || word.startsWith("#") || word.startsWith("//")) return;
    _banned.add(word);
  });
}

// loadLists: populate the _banned set from bundled locale files
// - we use vite's ?raw imports so the files are included in the bundle
// - mark _loaded to avoid repeated work
async function loadLists() {
  if (_loaded) return;

  try {
    // add words from hungarian and english lists into the set
    addWordsFromText(huWordsRaw);
    addWordsFromText(enWordsRaw);
    _loaded = true;
  } catch (err) {
    // if something goes wrong, log and keep _loaded false so callers
    // can try again or fail safely
    console.warn("Failed to load profanity lists", err);
    _loaded = false;
  }
}

// usernameIsProfane: main exported check used by register and profile code
// - input: username (string)
// - returns: boolean (true when the username should be rejected)
// logic:
// 1) ensure lists are loaded
// 2) normalize username with unicode nfc and lowercase
// 3) split into tokens using a unicode-aware separator (letters/numbers kept)
// 4) if any token exactly matches a banned token -> profane
// 5) for longer banned words (>=4 chars) allow substring match to catch
//    cases where the banned word appears inside a longer username
export async function usernameIsProfane(username) {
  if (!username) return false;

  await loadLists();

  // normalize and trim the incoming username for stable comparisons
  const normalized = String(username).toLowerCase().normalize("NFC").trim();

  // split on any character that is not a unicode letter or number
  // this keeps letters from many scripts (not just ascii) as tokens
  const tokens = normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  // check exact token matches first (fast path)
  for (const token of tokens) {
    if (_banned.has(token)) return true;
  }

  // then check substring matches for longer banned words to reduce false
  // positives for short tokens but still catch embedded offensive words
  for (const word of _banned) {
    if (word.length >= 4 && normalized.includes(word)) return true;
  }

  return false;
}

// getProfanityList: helper to expose the currently loaded banned list (array)
export async function getProfanityList() {
  await loadLists();
  return Array.from(_banned);
}