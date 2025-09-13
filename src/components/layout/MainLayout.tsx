import Image from "next/image";
import styles from "./MainLayout.module.scss";

type Props = { children: React.ReactNode };

export default function MainLayout({ children }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.starryBg} aria-hidden="true" />

      <Image
        src={"/images/letters-rick-morty.png"}
        alt=""
        aria-hidden="true"
        className={styles.logo}
        width={332}
        height={95}
        priority
      />

      <Image
        src={"/images/degraded.png"}
        alt=""
        aria-hidden="true"
        className={styles.grass}
        width={100}
        height={100}
        priority
      />

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
