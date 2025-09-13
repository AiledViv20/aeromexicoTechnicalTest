import { useMemo, useState } from "react";
import styles from "./CharacterPanel.module.scss";
import CharacterDetail from "./CharacterDetail";
import CharacterList from "./CharacterList";

export type Character = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  description: string;
  gender: "Male" | "Female" | "unknown";
  origin: string;
  location: string;
  episodes: number;
  imageLarge: string;
};

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: "Rick Sánchez",
    status: "Alive",
    species: "Human",
    description: "Rick's Toxic Side",
    gender: "Male",//
    origin: "Alien Spa",//
    location: "Earth",//
    episodes: 132,//
    imageLarge: "/images/card/character1.jpg",
  },
  {
    id: 2,
    name: "Morty",
    status: "Alive",
    species: "Human",
    description: "Morty's Toxic Side",
    gender: "Male",
    origin: "Earth",
    location: "Earth",
    episodes: 120,
    imageLarge: "/images/card/character2.png",
  },
  {
    id: 3,
    name: "Summer",
    status: "Alive",
    species: "Human",
    description: "Summer's Toxic Side",
    gender: "Female",
    origin: "Earth",
    location: "Earth",
    episodes: 80,
    imageLarge: "/images/card/character3.jpg",
  },
  {
    id: 4,
    name: "Tuberculosis",
    status: "Dead",
    species: "Unknown",
    description: "Tuberculosis's Toxic Side",
    gender: "unknown",
    origin: "Unknown",
    location: "Unknown",
    episodes: 1,
    imageLarge: "/images/card/character4.jpg",
  },
];

export default function CharacterPanel() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number>(CHARACTERS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHARACTERS;
    return CHARACTERS.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const selected = useMemo(
    () => CHARACTERS.find((c) => c.id === selectedId) ?? CHARACTERS[0],
    [selectedId]
  );

  return (
    <section className={styles.panel} aria-label="Character browser">
      <CharacterDetail character={selected} />

      <CharacterList
        items={filtered}
        query={query}
        onQueryChange={setQuery}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </section>
  );
}
