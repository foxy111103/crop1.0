import React, { useContext, useState } from "react";
import { Web3Context } from "../component/Web3Context";
import qrcode from "qrcode";


const ConsumerPage = ()=>{
  const { contract, account } = useContext(Web3Context);
  const [cropId, setCropId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const fetchCropDetails = async () => {
    try {
      const crop = await contract.methods.getCrop(cropId).call();
      alert(`Crop ID: ${crop.id}\nFarmer: ${crop.farmer}\nHealth Score: ${crop.healthScore}\nVerification Status: ${ ["Pending", "Approved", "Rejected"][crop.status]}`);
    } catch (error) {
      console.error("Error fetching crop details:", error);
    }
  };

  const getQr = async() => {
    const crop = await contract.methods.getCrop(cropId).call();
    const qrText = `
      Crop ID: ${crop?.id || "N/A"}
      Health Score: ${crop?.healthScore || "N/A"}
      Farmer: ${crop?.farmer || "N/A"}
      Distributor: ${crop?.distributor || "N/A"}
      Merchant: ${crop?.merchant || "N/A"}
      Status: ${crop?.status || "N/A"}
    `;

    qrcode.toDataURL(qrText).then(setQrCodeUrl);
  };

  return(
    <div>
      <h1>Consumer 
      </h1>
      <p>Account: {account}</p>
      <h2>Fetch Crop Details</h2>
      <input
        type="number"
        placeholder="Crop ID"
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
      />
      <button onClick={fetchCropDetails}>Fetch Details</button>

      <h2>Generate QR Code</h2>
      <button onClick={getQr}>Generate QR</button>
      {qrCodeUrl && (
        <div>
          <h3>QR Code</h3>
          <img src={qrCodeUrl} alt="Crop QR Code" />
        </div>
      )}


    </div>
  );
 
};
export  default  ConsumerPage;