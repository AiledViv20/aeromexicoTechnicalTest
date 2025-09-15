import Image from "next/image";
import styles from "./CharacterPanel.module.scss";
import type { Character } from "./CharacterPanel";

export default function CharacterDetail({ character }: { character: Character }) {
  return (
    <article className={styles.detail}>
      <div className={styles.detailImgWrap}>
        <Image
          src={character.imageLarge}
          alt={character.name}
          fill
          className={styles.detailImg}
          priority
        />
        <span className={styles.liveBadge}>
          <Image
            src={character.status === "Alive" ? 
              "/icons/card/live.svg" : character.status === "Dead" ? "/icons/card/dead.svg" : "/icons/card/unknown.svg"}
            alt="Icon status character"
            aria-hidden="true"
            className={styles.dot}
            width={15}
            height={15}
            priority
          />{character.status === "Alive" ? "LIVE" : character.status}
        </span>
      </div>

      <footer className={styles.detailFooter}>
        <div>
          <h3 className={styles.name}>{character.name}</h3>
          <p className={styles.muted}>{character.species}</p>
        </div>

        <ul className={styles.meta}>
          <li>
            <strong>Origin</strong>
            <span>{character.origin}</span>
          </li>
          <li>
            <strong>Location</strong>
            <span>{character.location}</span>
          </li>
          <li>
            <strong>Gender</strong>
            <span>{character.gender}</span>
          </li>
          <li>
            <strong>Episodes</strong>
            <span>{character.episodes}</span>
          </li>
        </ul>
      </footer>
    </article>
  );
}
