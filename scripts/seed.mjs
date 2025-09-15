import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCharacters } from "rickmortyapi";

const arg = process.argv.find(a => a.startsWith("--limit="));
const LIMIT = arg ? parseInt(arg.split("=")[1], 10) : 24;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "..", "db.json");

const mapApiToCharacter = (c) => ({
  id: c.id,
  name: c.name,
  status: c.status ?? "unknown",
  species: c.species ?? "Unknown",
  gender: c.gender ?? "unknown",
  origin: c.origin?.name ?? "Unknown",
  location: c.location?.name ?? "Unknown",
  episodes: Array.isArray(c.episode) ? c.episode.length : 0,
  imageLarge: c.image,
});

async function fetchLimitedCharacters(limit) {
  const out = [];
  let page = 1;
  while (out.length < limit) {
    const { data } = await getCharacters({ page });
    const items = data?.results ?? [];
    if (!items.length) break;

    for (const c of items) {
      out.push(mapApiToCharacter(c));
      if (out.length >= limit) break;
    }
    page++;
    if (page > (data?.info?.pages ?? page)) break;
  }
  return out;
}

(async function main() {
  const characters = await fetchLimitedCharacters(LIMIT);
  const db = { characters, favorites: [] }; // favoritos persistidos aquí
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  console.log(`✅ db.json creado con ${characters.length} personajes en ${DB_PATH}`);
})().catch((e) => {
  console.error("❌ Error creando seed:", e);
  process.exit(1);
});
