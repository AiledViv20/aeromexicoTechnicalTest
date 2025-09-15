import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./CharacterPanel.module.scss";
import type { Character } from "./CharacterPanel";

type Props = {
  items: Character[];
  query: string;
  onQueryChange: (v: string) => void;
  selectedId: number;
  onSelect: (id: number) => void;
  pageSize?: number;
  onToggleFavorite: (id: number, nextValue: boolean) => void;
  favIds: number[];
};

export default function CharacterList({
  items,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  pageSize = 4,
  onToggleFavorite,
  favIds,
}: Props) {
  const [page, setPage] = useState(0);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    setPage(0);
  }, [query, items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const handlePrev = () => { if (canPrev) setPage((p) => p - 1); };
  const handleNext = () => { if (canNext) setPage((p) => p + 1); };

  const getFirstName = (fullName: string) => fullName.trim().split(" ")[0];

  // favoritos para pintar en el panel
  const favCharacters = useMemo(
    () => favIds
      .map(id => items.find(c => c.id === id))
      .filter(Boolean) as Character[],
    [favIds, items]
  );

  return (
    <div className={styles.containerList}>
      <aside className={styles.list}>
        {/* Search */}
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

        {/* Grid de cards */}
        <div className={styles.grid}>
          {pageItems.map((c) => {
            const active = c.id === selectedId;
            const isFav = favIds.includes(c.id);
            const icon = isFav
              ? "/icons/card/marked-favorite.svg"
              : "/icons/card/unmarked-favorite.svg";
            return (
              <div
                key={c.id}
                className={`${styles.card} ${active ? styles.cardActive : ""}`}
                onClick={() => onSelect(c.id)}
                role="button"
                tabIndex={0}
                aria-pressed={active}
              >
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>{getFirstName(c.name)}</span>
                </div>
                <div className={styles.cardThumb}>
                  <Image src={c.imageLarge} alt={c.name} width={120} height={120} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.spaceBtnLike}></div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(c.id, !isFav);
                    }} 
                    className={styles.cardLike}
                    aria-pressed={isFav}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}>
                    <Image src={icon} alt="" width={24} height={24} />
                    Like</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAVS toggle */}
        <div className={styles.favs}>
          {!showFavs ? (
            <button
              type="button"
              className={styles.btnFavs}
              onClick={() => setShowFavs(true)}
              aria-haspopup="dialog"
              aria-expanded="false"
            >
              FAVS
            </button>
          ) : (
            <div className={styles.favsPanel} role="dialog" aria-label="Favorites">
              <div className={styles.favsHeader}>
                <button
                  type="button"
                  className={styles.btnCloseFavs}
                  onClick={() => setShowFavs(false)}
                  aria-label="Close favorites"
                >
                  <Image src={"/icons/card/close-favs.png"} alt="" width={22} height={22} />
                </button>
              </div>

              <ul className={styles.favList}>
                {favCharacters.length === 0 && (
                  <li className={styles.favEmpty}>No favorites yet</li>
                )}
                {favCharacters.map((f) => (
                  <li key={f.id} className={styles.favItem}>
                    <button
                      type="button"
                      className={styles.favItemBtn}
                      onClick={() => { onSelect(f.id); setShowFavs(false); }}
                    >
                      {getFirstName(f.name)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Pager */}
      <nav className={styles.pager} aria-label="Character list pagination">
        <div className={styles.arrowCtnrTop}>
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.arrowBtn} ${!canPrev ? styles.arrowDisabled : ""}`}
            aria-label="Previous"
            disabled={!canPrev}
          >
            <Image src={"/icons/card/arrow-top.svg"} alt="" aria-hidden="true" width={32} height={32} priority />
          </button>
        </div>
        <div className={styles.arrowCtnrBottom}>
          <button
            type="button"
            onClick={handleNext}
            className={`${styles.arrowBtn} ${!canNext ? styles.arrowDisabled : ""}`}
            aria-label="Next"
            disabled={!canNext}
          >
            <Image src={"/icons/card/arrow-bottom.svg"} alt="" aria-hidden="true" width={32} height={32} priority />
          </button>
        </div>
      </nav>
    </div>
  );
}
