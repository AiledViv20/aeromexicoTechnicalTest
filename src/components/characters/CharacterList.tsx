import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./CharacterPanel.module.scss";
import type { Character } from "./CharacterPanel";

type Props = {
  items: Character[];
  allItemsForFavs?: Character[];
  query: string;
  onQueryChange: (v: string) => void;
  selectedId: number;
  onSelect: (id: number) => void;
  pageSize?: number;
  onToggleFavorite: (id: number, nextValue: boolean) => void;
  favIds: number[];
  maxFavs?: number;
};

export default function CharacterList({
  items,
  allItemsForFavs,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  pageSize = 4,
  onToggleFavorite,
  favIds,
  maxFavs = 4,
}: Props) {
  const [page, setPage] = useState(0);
  const [showFavs, setShowFavs] = useState(false);

  const [effectivePageSize, setEffectivePageSize] = useState(pageSize);
  const sourceForFavs = allItemsForFavs ?? items;

  useEffect(() => {
    const updatePageSize = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 480;
      setEffectivePageSize(isMobile ? 2 : pageSize);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [pageSize]);

  useEffect(() => {
    setPage(0);
  }, [query, items.length, effectivePageSize]);

  const totalPages = Math.max(1, Math.ceil(items.length / effectivePageSize));

  const pageItems = useMemo(() => {
    const start = page * effectivePageSize;
    return items.slice(start, start + effectivePageSize);
  }, [items, page, effectivePageSize]);

  useEffect(() => {
    if (page >= totalPages) setPage(totalPages - 1);
  }, [totalPages, page]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const handlePrev = () => { if (canPrev) setPage((p) => p - 1); };
  const handleNext = () => { if (canNext) setPage((p) => p + 1); };

  const getFirstName = (fullName: string) => fullName.trim().split(" ")[0];

  // favoritos para pintar en el panel
  const favCharacters = useMemo(
    () => favIds
      .map(id => sourceForFavs.find(c => c.id === id))
      .filter(Boolean)
      .slice(0, maxFavs) as Character[],
    [favIds, sourceForFavs, maxFavs]
  );

  return (
    <div className={styles.containerList}>
      <aside className={styles.list}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrap}>
            <Image
              src={"/icons/search-bar.svg"}
              alt="Icon search bar"
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
            // deshabilitar si intenta marcar y ya hay 4 (y este no es fav)
            const likeDisabled = !isFav && favIds.length >= maxFavs;
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
                      if (likeDisabled) return; 
                      onToggleFavorite(c.id, !isFav);
                    }} 
                    className={`${styles.cardLike} ${likeDisabled ? styles.likeDisabled : ""}`}
                    disabled={likeDisabled}
                    aria-pressed={isFav}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    title={likeDisabled ? "You can only select up to 4 favorites" : "Toggle favorite"}>
                    <Image src={icon} alt="Icon marked favorite" width={24} height={24} />
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
                  <Image src={"/icons/card/close-favs.png"} alt="Icon close favs" width={22} height={22} />
                </button>
              </div>

              <ul className={styles.favList}>
                {favCharacters.length === 0 && (
                  <li className={styles.favEmpty}>No favorites yet</li>
                )}
                {favCharacters.map((f) => (
                  <li key={f.id} className={styles.favItem}>
                    <div
                      className={styles.favItemBtn}
                      onClick={() => { onSelect(f.id); setShowFavs(false); }}
                      role="button"
                      tabIndex={0}
                    >
                      <p>{getFirstName(f.name)}</p>
                      <button 
                        type="button" 
                        className={styles.btnTrashFav}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(f.id, false);
                        }}
                        aria-label={`Remove ${getFirstName(f.name)} from favorites`}
                        title="Remove from favorites">
                          <Image src={"/icons/card/trash-can.svg"} alt="Icon trash favs" width={15} height={20} />
                      </button>
                    </div>
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
            <span className={styles.arrowIconTop} />
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
            <span className={styles.arrowIconBottom} />
          </button>
        </div>
      </nav>
    </div>
  );
}
