import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Sepolia } from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain= {Sepolia}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;

