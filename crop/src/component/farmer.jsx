import React, { useContext, useState } from "react";
import { Web3Context } from "../component/Web3Context";

const FarmerPage = () => {
  const {contract, account } = useContext(Web3Context);
  const [healthScore, setHealthScore] = useState("");

  const createCrop = async () => {
    if (!healthScore || healthScore <= 0 || healthScore > 100) {
      alert("Health score must be between 1 and 100.");
      return;
    }

    try {
      await contract.methods.createCrop(healthScore).send({
        from: account,
        gas: 3000000, // Adjust as needed
      });

      alert("Crop created successfully!");
    } catch (error) {
      console.error("Error creating crop:", error);

      if (error.data) {
        console.error("Revert reason:", error.data);
      }

      alert("Failed to create crop. Check inputs or contract conditions.");
    }
  };

  return (
    <div>
      <h1>Farmer Dashboard</h1>
      <h2>Create Crop</h2>
      <input
        type="number"
        placeholder="Health Score"
        value={healthScore}
        onChange={(e) => setHealthScore(e.target.value)}
      />
      <button onClick={createCrop}>Create Crop</button>
    </div>
  );
};

export default FarmerPage;
