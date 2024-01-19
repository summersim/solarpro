import type { NextPage } from "next";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import ButtonPrimarySmall from "../components/button-primary-small";
import styles from "../styles/home.module.css";
import { ConnectWallet, Web3Button } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const tokenToContractAddress: Record<string, string> = {
  LDN: '0x7C860b93424f8b6eeb80c4e633fE8ce8ec199BB6',
  SLR: '0xD922D67eF6Cb7c330732eAF2Dbc31642C4eEDF26',
};

const Swap: NextPage = () => {
  const router = useRouter();

  const onHomeTextClick = useCallback(() => {
    router.push("/home");
  }, [router]);

  const onTradeTextClick = useCallback(() => {
    router.push("/trade");
  }, [router]);

  const onTokensTextClick = useCallback(() => {
    router.push("/tokens");
  }, [router]);

  const [selectedItem, setSelectedItem] = useState("");
  const [inputValue, setInputValue] = useState("");
  const isWeb3Connected = typeof window !== 'undefined' && window.ethereum && window.ethereum.isConnected();
  const [isClient, setIsClient] = useState(false);
  const ammContractAddress = '0xc5808e7B76a4da4a43a1F84e2046E45285CeCC3B';
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSwap = async () => {
    try {
      console.log('Handling swap...');
      // Ensure selectedItem is either "LDN" or "SLR"
      if (selectedItem !== "LDN" && selectedItem !== "SLR") {
        console.error("Invalid token selected");
        return;
      }

      // Parse inputValue to a number
      const amountIn = parseFloat(inputValue);

      // Check if amountIn is a valid number
      if (isNaN(amountIn) || amountIn <= 0) {
        console.error("Invalid amount entered");
        return;
      }

      // Get the contract address based on the selected token
      const tokenAddress = tokenToContractAddress[selectedItem]
      if (!tokenAddress) {
        throw new Error('Invalid token selected');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const abi = ['function swapTokens(address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut)'];
      const contract = new ethers.Contract(ammContractAddress, abi, signer);


      // Call the swapTokens function on the smart contract
      const tx = await contract.swapTokens(tokenAddress, amountIn, { gasLimit: 300000 });

      const receipt = await tx.wait();
      console.log('Receipt:', receipt);
      if (receipt.status === 0) {
        // Log additional information from logs, if available
        console.log('Revert Message:', /* parse and log revert message from logs */);
      }

      const revertMessage = receipt.logs.find((log: any) => log.topics[0] === ethers.utils.id('Error(string)'));
      console.error('Revert Message:', revertMessage ? ethers.utils.parseBytes32String(revertMessage.data) : 'No revert message');


      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Swap successful!');
    } catch (error: any) {
      console.error('Error swapping tokens:', error.message);
    }
    
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


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
            <div className={styles.home1} onClick={onHomeTextClick}>
              Home
              </div>
            <div className={styles.swap}>
              Swap
            </div>
          </div>
        </div>
      </div>
      <div className={styles.btc}>
        <div className={styles.youPay}>You pay</div>
        <input
          type="number"
          className={`${styles.div7} ${styles.inputField}`}
          placeholder="Enter amount"
          value={inputValue}
          onChange={handleInputChange}
          style={{ width: "30%" }}
        />
       
        <ButtonPrimarySmall
          buttonPrimarySmallBackgroundColor="#fc552f"
          buttonPrimarySmallWidth="134px"
          buttonPrimarySmallHeight="44px"
          buttonPrimarySmallJustifyContent="center"
          buttonPrimarySmallPosition="absolute"
          buttonPrimarySmallTop="81px"
          buttonPrimarySmallLeft="600px"
          browseProductsFontSize="14px"
          browseProductsColor="#fffbfa"
          browseProductsFontWeight="bold"
          dropdown={
            <select
              value={selectedItem}
              onChange={handleRegionChange}
              style={{
                width: "200px",
                height: "44px",
                background: "#fc552f",
                color: "#fffbfa",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              <option value="LDN">London Token</option>
              <option value="SLR">Solar Token</option>
            </select>
          }
        />
      </div>

      <div className={styles.buttonContainer}>
      {isClient && isWeb3Connected ? (
      <Web3Button
      contractAddress={ammContractAddress}
        action={handleSwap}
        >
          Swap
        </Web3Button>
        ) : (
          <div>Connect your wallet to enable swapping.</div>
        )}
    </div>
    </div>
  );
};

export default Swap;
