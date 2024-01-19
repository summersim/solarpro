import { useCallback, useState, useEffect } from "react"
import { ethers } from 'ethers';
import { Web3Button, ConnectWallet } from '@thirdweb-dev/react';
import { NextPage } from 'next';
import { useMemo, type CSSProperties } from "react";
import styles from '../components/mint-section.module.css';

// Define regionToContractAddress outside the component
const regionToContractAddress: Record<string, string> = {
  LDN: '0x7C860b93424f8b6eeb80c4e633fE8ce8ec199BB6',
  STH: '0x2f05494B3d4ABE4BaECD2Ca4b0fB8D079041168F',
  WST: '0x48515A0F219A50C231bf5d346d83928745DA2B83',
  EST: '0x0DaB5fcCe5A7af3f241b6f0f864Fad0f6672225C',
  NTH: '0xAd96CF5f8039A4fd61673c8c139d05A2854A8F53',
};

const MintSection: NextPage = () => {
  const [energyProducedInEther, setEnergyProducedInEther] = useState('');
  const [regionSelectorLabel, setRegionSelectorLabel] = useState("");
  const [selectedGender, setSelectedGender] = useState('');

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setEnergyProducedInEther(event.target.value);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRegionSelectorLabel(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value);
  };

  const handleMintTokens = async () => {
    try {
      console.log('regionSelectorLabel:', regionSelectorLabel);
      console.log('contractAddress:', regionToContractAddress[regionSelectorLabel]);

      if (!regionSelectorLabel) {
        throw new Error('Select a region before minting tokens');
      }

      const energyProducedInKWh = ethers.utils.parseEther(energyProducedInEther);

      const contractAddress = regionToContractAddress[regionSelectorLabel];
      if (!contractAddress) {
        throw new Error('Invalid region selected');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const abi = ['function mintTokens(uint256 energyProducedInKWh)'];
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.mintTokens(energyProducedInKWh);
      await tx.wait();

      console.log('Tokens minted successfully!');
    } catch (error) {
      console.error('Error minting tokens:', error);
      // Handle the error, show a message, etc.
    }
  };


  return (
    <div className={styles.buttonParent}>


      {/* Energy Produced Input */}
      <div className={styles.energyProducedContainer}>
        <label>Energy Produced</label>
        <input
          type="number"
          className={`${styles.div7} ${styles.inputField}`}
          placeholder="KwH"
          value={energyProducedInEther}
          onChange={handleInputChange}
          style={{ width: "30%" }}
        />
      </div>
      
      <div className={styles.regionDropdownContainer}>
        <label>Your current region</label>
        <select
          value={regionSelectorLabel}
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
          <option value="" disabled>Select</option>
            <option value="LDN">London</option>
            <option value="STH">South</option>
            <option value="WST">West</option>
            <option value="EST">East</option>
            <option value="NTH">North</option>
        </select>
      </div>

      <div className={styles.buttonContainer}>
      {regionSelectorLabel && (
        <Web3Button
          contractAddress={regionToContractAddress[regionSelectorLabel]}
          action={handleMintTokens}
          className={styles.web3Button}
        >
          Mint
        </Web3Button>
      )}
    </div>
    </div>
  );
};

export default MintSection;
