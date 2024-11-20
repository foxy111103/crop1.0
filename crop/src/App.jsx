import { useState,useEffect } from 'react'
import {ethers} from "ethers"
import ABI from "./ABI.json"
import './App.css'
import qrcode from 'qrcode'

function App() {
  const [provider,setProvider]=useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState(null);
  const [cropId, setCropId] = useState("");
  const [healthScore, setHealthScore] = useState("");
  const [cropDetails, setCropDetails] = useState(null);
  const [balance, setBalance] = useState("0");
  const [data,setData]=useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const contractAdd="0x67e48DA90b24B1e4cdf6eAaF727394E851564B87";
  useEffect(()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider=async()=>{
      try{
        //functionality provided by metamask
        window.ethereum.on("chainChanged",()=>{
          window.location.reload();
        });
        window.ethereum.on("accountsChanged",()=>{
          window.location.reload();
        });
        await provider.send("eth_requestAccounts",[]);
      setProvider(provider);
      const signer=provider.getSigner();
      const account=await signer.getAddress();
      setSigner(account);
      const contract= new ethers.Contract(contractAdd,ABI,signer);
      setContract(contract);
      console.log(provider);
      console.log(contract);
      }
      catch(error){
        alert("Metamask not installed");
      }

    }

    provider && loadProvider();
  },[])
  
  
  
  const registerRole = async (_role) => {
    const tx = await contract.registerRole(_role);
    await tx.wait();
    setRole(_role);
  };

  const createCrop = async () => {
    const tx = await contract.createCrop(healthScore);
    await tx.wait();
    alert("Crop created successfully!");
  };

  const verifyCrop = async (type) => {
    if (!contract) {
      console.error("Contract is not initialized");
      alert("Contract is not initialized. Please connect to MetaMask first.");
      return;
    }
    
    if (!cropId) {
      alert("Please enter a valid Crop ID");
      return;
    }
  
    try {
      console.log("Verifying crop with type:", type, "and cropId:", cropId);
      const tx = type === "distributor"
        ? await contract.verifyCropByDistributor(cropId)
        : await contract.verifyCropByMerchant(cropId);
  
      await tx.wait(); // Wait for confirmation
      alert(`Crop verified by ${type} successfully`);
    } catch (error) {
      console.error(`Error verifying crop by ${type}:`, error);
      alert(`Failed to verify crop by ${type}`);
    }
  };
  

  const getCropDetails = async () => {
    const crop = await contract.getCrop(cropId);
    setCropDetails({
      id: crop[0].toString(),
      farmer: crop[1],
      distributor: crop[2],
      merchant: crop[3],
      healthScore: crop[4].toString(),
      status: crop[5],
    });
    
  };
  const getQr=()=>{
    const qrText = JSON.stringify(cropDetails);
    console.log(qrText);
    qrcode.toDataURL(qrText).then(setQrCodeUrl);
  }
  const depositFunds = async () => {
    const tx = await contract.depositFunds({ value: ethers.utils.parseEther("0.1") });
    await tx.wait();
    alert("Funds deposited to contract!");
  };

  const getBalance = async () => {
    const balance = await contract.getAmt();
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div>
      <h1>Crop Supply Chain DApp</h1>
      
      <p>{signer}</p>

      <h2>Register Role</h2>
      <button onClick={() => registerRole(1)}>Register as Farmer</button>
      <button onClick={() => registerRole(2)}>Register as Distributor</button>
      <button onClick={() => registerRole(3)}>Register as Merchant</button>
      
      <h2>Create Crop (Farmer Only)</h2>
      <input
        type="number"
        placeholder="Health Score"
        value={healthScore}
        onChange={(e) => setHealthScore(e.target.value)}
      />
      <button onClick={createCrop}>Create Crop</button>
      
      <h2>Verify Crop</h2>
      <input
        type="number"
        placeholder="Crop ID"
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
      />
      <button onClick={() => verifyCrop("distributor")}>Verify by Distributor</button>
      <button onClick={() => verifyCrop("merchant")}>Verify by Merchant</button>

      <h2>Get Crop Details</h2>
      <input
        type="number"
        placeholder="Crop ID"
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
      />
      <button onClick={getCropDetails}>Get Details</button>
      <button onClick={getQr}>Get QR</button>
      {cropDetails && (
        <div>
          <p>Crop ID: {cropDetails.id}</p>
          <p>Farmer: {cropDetails.farmer}</p>
          <p>Distributor: {cropDetails.distributor}</p>
          <p>Merchant: {cropDetails.merchant}</p>
          <p>Health Score: {cropDetails.healthScore}</p>
          <p>Status: {["Pending", "Approved", "Rejected"][cropDetails.status]}</p>
        </div>
      )}
       {qrCodeUrl && (
        <div>
          <h3>Crop Details QR Code</h3>
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}
      <h2>Contract Balance</h2>
      <button onClick={getBalance}>Get Balance</button>
      <p>Balance: {balance} ETH</p>

      <h2>Deposit Funds</h2>
      <button onClick={depositFunds}>Deposit 0.1 ETH</button>
    </div>
  );
}

export default App
