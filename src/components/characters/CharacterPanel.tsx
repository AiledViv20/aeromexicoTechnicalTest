import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CharacterPanel.module.scss";
import CharacterDetail from "./CharacterDetail";
import CharacterList from "./CharacterList";
import { getCharacters } from "rickmortyapi";

export type Character = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  gender: "Male" | "Female" | "unknown";
  origin: string;
  location: string;
  episodes: number;
  imageLarge: string;
};

export default function CharacterPanel() {
  const [query, setQuery] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  // mapper desde la respuesta del API en type interno
  const mapApiToCharacter = (c: any): Character => ({
    id: c.id,
    name: c.name,
    status: c.status,
    species: c.species,
    gender: c.gender,
    origin: c.origin?.name ?? "Unknown",
    location: c.location?.name ?? "Unknown",
    episodes: Array.isArray(c.episode) ? c.episode.length : 0,
    imageLarge: c.image,
  });

  // fetch: carga por nombre (si hay query) o primer page
  const fetchData = async (name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = name ? { name } : { page: 1 };
      const res = await getCharacters(params);
      const results = res?.data?.results ?? [];
      const mapped: Character[] = results.map(mapApiToCharacter);
      setCharacters(mapped);

      // si no hay seleccionado o ya no existe en la lista, selecciona el primero
      if (!mapped.length) {
        setSelectedId(null);
      } else if (!selectedId || !mapped.some((m) => m.id === selectedId)) {
        setSelectedId(mapped[0].id);
      }
    } catch (e: any) {
      // El cliente devuelve error si no hay resultados (404). Se tratará como lista vacía.
      if (e?.response?.status === 404) {
        setCharacters([]);
        setSelectedId(null);
      } else {
        setError("Error fetching characters");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // búsqueda con debounce
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchData(query.trim() || undefined);
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const selected = useMemo(
    () => (selectedId ? characters.find((c) => c.id === selectedId) ?? null : null),
    [characters, selectedId]
  );

  return (
    <section className={styles.panel} aria-label="Character browser">
      {loading && !selected && (
        <div className={styles.detail} style={{ display: "grid", placeItems: "center", fontSize: "18px", color: "#FFF" }}>
          <span>Loading…</span>
        </div>
      )}
      {!loading && !selected && (
        <div className={styles.detail} style={{ display: "grid", placeItems: "center", color: "#FFF" }}>
          <span>{error ?? 
            <div className={styles.showNotResults}>
              <p>No characters found</p>
              <Image
                src={"/icons/card/without-results.png"}
                alt=""
                width={150}
                height={150}
              />
            </div>
          }</span>
        </div>
      )}
      {selected && <CharacterDetail character={selected} />}

      <CharacterList
        items={characters}
        query={query}
        onQueryChange={setQuery}
        selectedId={selectedId ?? -1}
        onSelect={setSelectedId}
      />
    </section>
  );
}
