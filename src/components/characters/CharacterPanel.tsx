import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CharacterPanel.module.scss";
import CharacterDetail from "./CharacterDetail";
import CharacterList from "./CharacterList";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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

  // fetch: carga por nombre (si hay query) o primer page
  const fetchData = async (name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/characters`);
      if (name) url.searchParams.set("name_like", name);
      url.searchParams.set("_sort", "id");
      url.searchParams.set("_order", "asc");
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("API error");
      const data: Character[] = await res.json();
      setCharacters(data);

      // si no hay seleccionado o ya no existe en la lista, selecciona el primero
      if (!data.length) {
        setSelectedId(null);
      } else if (!selectedId || !data.some(d => d.id === selectedId)) {
        setSelectedId(data[0].id);
      }
    } catch (e) {
      // El cliente devuelve error si no hay resultados (404). Se tratará como lista vacía.
      setError("Error fetching characters");
      setCharacters([]);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  };

  // primera carga
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // búsqueda con debounce
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const q = query.trim();
      fetchData(q || undefined);
    }, 350);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const selected = useMemo(
    () => (selectedId ? characters.find(c => c.id === selectedId) ?? null : null),
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
