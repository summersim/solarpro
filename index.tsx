import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import ButtonPrimarySmall from "../components/button-primary-small";
import styles from '../styles/home.module.css';

const Connect: NextPage = () => {
  const address = useAddress();
  const router = useRouter();

  const onHomeTextClick = useCallback(() => {
    router.push("/home");
  }, [router]);

  const onSwapTextClick = useCallback(() => {
    router.push("/swap");
  }, [router]);

  const onBuyTextClick = useCallback(() => {
    router.push("/trade");
  }, [router]);

  const onTokensTextClick = useCallback(() => {
    router.push("/tokens");
  }, [router]);

  const onTrackTextClick = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    // Check if the wallet is connected
    if (address) {
      // Navigate to the "Home" page
      router.push("/home");
    }
  }, [address, router]);

  return (
    <div className={styles.home}>
      <div className={styles.divParent}>
        <div className={styles.trackParent}>
          <div className={styles.div1}>
            
            <div className={styles.div5}>
              <ConnectWallet
                dropdownPosition={{
                  side: 'bottom',
                  align: 'center',
                }}
              />
              <div className={styles.div6} />
              <img className={styles.svgIcon3} alt="" src="/svg@2x.png" />
            </div>
          </div>
          <img className={styles.favicon1} alt="" src="/favicon-1@2x.png" />
          <div className={styles.div}>
            <div className={styles.home1}>Home</div>
            <div className={styles.swap} onClick={onSwapTextClick}>
              Swap
            </div>
          </div>
        </div>
      </div>
      <b className={styles.welcomeToSolarContainer}>
        <p className={styles.welcomeTo}>{`WELCOME TO `}</p>
        <p className={styles.solarPro}>SOLAR PRO</p>
      </b>
      <div className={styles.connectWalletContainer}>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Connect;
