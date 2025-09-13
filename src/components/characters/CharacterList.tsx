import Image from "next/image";
import styles from "./CharacterPanel.module.scss";
import type { Character } from "./CharacterPanel";

type Props = {
  items: Character[];
  query: string;
  onQueryChange: (v: string) => void;
  selectedId: number;
  onSelect: (id: number) => void;
};

export default function CharacterList({
  items,
  query,
  onQueryChange,
  selectedId,
  onSelect,
}: Props) {
  return (
    <aside className={styles.list}>
      <div className={styles.searchContainer}>
        <div className={styles.searchWrap}>
          <Image
            src={"/icons/search-bar.svg"}
            alt=""
            aria-hidden="true"
            className={styles.iconSearchBar}
            width={24}
            height={24}
            priority
          />
          <input
            className={styles.search}
            placeholder="Find your character..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search characters"
          />
        </div>
      </div>

      <div className={styles.grid}>
        {items.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              className={`${styles.card} ${active ? styles.cardActive : ""}`}
              onClick={() => onSelect(c.id)}
              aria-pressed={active}
            >
              <div className={styles.cardBody}>
                <span className={styles.cardTitle}>{c.name}</span>
              </div>
              <div className={styles.cardThumb}>
                <Image
                  src={c.imageLarge}
                  alt={c.name}
                  width={120}
                  height={120}
                />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardLike}>Like</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
