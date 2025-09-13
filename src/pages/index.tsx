import Head from "next/head";
import dynamic from "next/dynamic";
import styles from "@/styles/Home.module.scss";

const CharacterPanel = dynamic(() => import("@/components/characters/CharacterPanel"));

export default function Home() {
  return (
    <>
      <Head>
        <title>AM | Technical Test</title>
        <meta name="description" content="Aeromexico Technical Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-rick.svg" />
      </Head>
      <main className={styles.main}>
        <CharacterPanel />
      </main>
    </>
  );
}
