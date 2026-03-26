// Simple client-side profanity checker that loads hu.txt and en.txt
let _loaded = false;
let _banned = new Set();

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function loadLists() {
  if (_loaded) return;
  _loaded = true;

  try {
    const paths = ['/src/hu.txt', '/src/en.txt'];
    const results = await Promise.all(paths.map(p => fetch(p).then(r => r.ok ? r.text() : '')));
    results.forEach(txt => {
      txt.split(/\r?\n/).forEach(line => {
        const w = line.trim().toLowerCase();
        if (!w) return;
        if (w.startsWith('#') || w.startsWith('//')) return;
        _banned.add(w);
      });
    });
  } catch (err) {
    console.warn('Failed to load profanity lists', err);
  }
}

export async function usernameIsProfane(username) {
  if (!username) return false;
  await loadLists();
  const s = String(username).toLowerCase().trim();

  // check exact token matches (split by non-alnum)
  const tokens = s.split(/[^a-z0-9]+/).filter(Boolean);
  for (const t of tokens) {
    if (_banned.has(t)) return true;
  }

  // check substring matches for longer banned words (reduce false positives)
  for (const w of _banned) {
    if (w.length >= 4 && s.includes(w)) return true;
  }

  return false;
}

export async function getProfanityList() {
  await loadLists();
  return Array.from(_banned);
}
