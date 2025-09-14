import { readFileSync, writeFileSync } from "fs";

const file = "db.json";
const db = JSON.parse(readFileSync(file, "utf-8"));
db.characters = db.characters.map(c => ({ ...c, favorite: false }));
writeFileSync(file, JSON.stringify(db, null, 2));
console.log("Favoritos reseteados.");