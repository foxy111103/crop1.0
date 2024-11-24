import React, { useContext, useState } from "react";
import { Web3Context } from "../component/Web3Context";
import qrcode from "qrcode";


const DistributorPage = () => {
  const { contract, account } = useContext(Web3Context);
  const [cropId, setCropId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  //const [cropDetails, setCropDetails] = useState(null);

  const verifyCrop = async () => {
    try {
      await contract.methods.verifyCrop(cropId).send({ from: account });
      alert("Crop verified successfully!");
    } catch (error) {
      console.error("Error verifying crop:", error);
    }
  };

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
      Pesticide Data: ${crop?.pesticideData || "N/A"}
      Transportation Status: ${crop?.transportationStatus || "N/A"}
      Shelf Life Data: ${crop?.shelfLifeData || "N/A"}
      Quality Check: ${crop?.qualityCheck || "N/A"}
      Feedback: ${crop?.feedback || "N/A"}
      Tampering Checked: ${crop?.tamperingChecked ? "Yes" : "No"}
    `;

    qrcode.toDataURL(qrText).then(setQrCodeUrl);
  };


  return (
    <div>
      <h1>Distributor Dashboard</h1>
      <h2>Verify Crop</h2>
      <input
        type="number"
        placeholder="Crop ID"
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
      />
      <button onClick={verifyCrop}>Verify Crop</button>

      <h2>Fetch Crop Details</h2>
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

export default DistributorPage;
