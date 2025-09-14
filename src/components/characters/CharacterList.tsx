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
};

export default function CharacterList({
  items,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  pageSize = 4,
}: Props) {
  const [page, setPage] = useState(0);

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

  const handlePrev = () => {
    if (canPrev) setPage((p) => p - 1);
  };
  const handleNext = () => {
    if (canNext) setPage((p) => p + 1);
  };

  function getFirstName(fullName: string) {
    return fullName.trim().split(" ")[0];
  }

  return (
    <div className={styles.containerList}>
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
          {pageItems.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                className={`${styles.card} ${active ? styles.cardActive : ""}`}
                onClick={() => onSelect(c.id)}
                aria-pressed={active}
              >
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>{getFirstName(c.name)}</span>
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
                  <div className={styles.spaceBtnLike}></div>
                  <button 
                    type="button"
                    onClick={() => console.log("agregado a favoritos")} 
                    className={styles.cardLike}>
                    <Image
                      src={"/icons/card/unmarked-favorite.svg"}
                      alt=""
                      width={24}
                      height={24}
                    />
                    Like</button>
                </div>
              </button>
            );
          })}
        </div>
        <div className={styles.favs}>
          <button 
            type="button" 
            className={styles.btnFavs}
            onClick={() => console.log("btnFavs")}>
            FAVS
          </button>
        </div>
      </aside>
      <nav 
        className={styles.pager}
        aria-label="Character list pagination">
        <div className={styles.arrowCtnrTop}>
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.arrowBtn} ${!canPrev ? styles.arrowDisabled : ""}`}
            aria-label="Previous"
            disabled={!canPrev}
          >
            <Image
              src={"/icons/card/arrow-top.svg"}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              priority
            />
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
            <Image
              src={"/icons/card/arrow-bottom.svg"}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              priority
            />
          </button>
        </div>
      </nav>
    </div>
  );
}
