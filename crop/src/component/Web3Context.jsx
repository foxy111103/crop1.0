import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import ABI from "../ABI.json";
//simport.meta.env

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const contractAddress =import.meta.env.VITE_ADDRESS;
  //const ABI=import.meta.env.VITE_ABI;
  useEffect(() => {
    const initWeb3 = async () => {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.requestAccounts();
      const contractInstance = new web3Instance.eth.Contract(
        ABI,
        contractAddress
      );

      const contractOwner = await contractInstance.methods.owner().call();
  
      setWeb3(web3Instance);
      setContract(contractInstance);
      setAccount(accounts[0]);
      setOwner(contractOwner);
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, contract, account, owner }}>
      {children}
    </Web3Context.Provider>
  );
};
