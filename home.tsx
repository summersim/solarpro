// Import necessary modules
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import MintSection from '../components/mint-section';
import TokenWalletContainer from '../components/token-wallet-container';
import { ConnectWallet, Web3Button } from '@thirdweb-dev/react'; 
import styles from '../styles/home.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  const onSwapTextClick = useCallback(() => {
    router.push('/swap');
  }, [router]);

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
      <MintSection/>
    </div>
  );
};

export default Home;
