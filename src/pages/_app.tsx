import type { AppProps } from "next/app";
import MainLayout from "@/components/layout/MainLayout";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Roboto_Condensed } from "next/font/google";

const robotoCondensed = Roboto_Condensed({ subsets: ["latin"], weight: ["400","700"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className={robotoCondensed.className}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </main>
    </Provider>
  );
}
