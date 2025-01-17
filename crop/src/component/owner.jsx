import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../component/Web3Context";

const OwnerPage = () => {
  const [pdata, setPdata] = useState("");
  const [tdata, setTdata] = useState("");
  const [sdata, setSdata] = useState("");
  const [qdata, setQdata] = useState("");
  const [cropId, setCropId] = useState("");
  const [farmer,setFarmer]=useState("");
  const [user_add,setUser_add]=useState("");
  const [accessInfo, setAccessInfo] = useState(null);


  const { contract, account, owner } = useContext(Web3Context);

  const updateCropData = async (field, value) => {
    try {
      await contract.methods.updateCropData(cropId, field, value).send({ from: account });
      alert(`${field} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Failed to update ${field}.`);
    }
  };
  const allow_access=async(user_add)=>{
    if (account.toLowerCase() !== owner.toLowerCase()) {
      alert("Only the owner can give access");
      return;
    }
    try{
      await contract.methods.allow(user_add).send({from: account});
      alert ("Access given successfully");
    }
    catch(error){
      alert ("error giving access");
    }

  }
  const farmer_info=async(f_add)=>{
    const acc_access = await contract.methods.accesslist(account).call();
    const isAuthorized = account.toLowerCase() === owner.toLowerCase() || acc_access;
    if (!isAuthorized){
      alert("Only the owner can perform this action or access is not allowed.");
      return;
    }
    
    try {
      const info = await contract.methods.farmerInfo(f_add).call();
      alert(`Name: ${info.name}`);
    } catch (error) {
      console.error("Error fetching farmer:", error);
      alert("An error occurred while fetching farmer information.");
    }
    };
  const distributor_info=async(f_add)=>{
    const acc_access = await contract.methods.accesslist(account).call();
    const isAuthorized = account.toLowerCase() === owner.toLowerCase() || acc_access;
    if (!isAuthorized) {
            alert("Only the owner can perform this action.");
            return;
          }
      
          try {
            const info=await contract.methods.distributorInfo(f_add).call();
            alert(`Name:${info.name}`)
          } catch (error) {
            console.error(`Error fetching farmerr:`, error);
            alert(`only owner can fetch`);
          }
        };
const merchant_info=async(f_add)=>{
  const acc_access = await contract.methods.accesslist(account).call();
  const isAuthorized = account.toLowerCase() === owner.toLowerCase() || acc_access;
  if (!isAuthorized) {
                alert("Only the owner can perform this action.");
                return;
              }
          
              try {
                const info=await contract.methods.merchatInfo(f_add).call();
                alert(`Name:${info.name}`)
              } catch (error) {
                console.error(`Error fetching farmerr:`, error);
                alert(`only owner can fetch`);
              }
            };
  const crop_acc=async(id)=>{
    const acc_access = await contract.methods.accesslist(account).call();
    const isAuthorized = account.toLowerCase() === owner.toLowerCase() || acc_access;
    if (!isAuthorized) {
        alert("Only the owner can perform this action.");
        return;
      }
  
      try {
        const info=await contract.methods.accounts(id).call();
        alert(`Farmer:${info.farmer}\nDistributor:${info.distributor}\nMerchant:${info.merchant}`)
      } catch (error) {
        console.error(`Error fetching farmerr:`, error);
        alert(`only owner can fetch`);
      }
  }

  const viewAccess = async()=>{
    
  }
  return (
    <div>
      <h1>Owner Account</h1>
      <p>Account: {account}</p>
      <p>Owner: {owner}</p>
      <input
        type="number"
        placeholder="Crop ID"
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Pesticide Data"
        value={pdata}
        onChange={(e) => setPdata(e.target.value)}
      />
      <input
        type="text"
        placeholder="Transport Data"
        value={tdata}
        onChange={(e) => setTdata(e.target.value)}
      />
      <input
        type="text"
        placeholder="Shelf Life Data"
        value={sdata}
        onChange={(e) => setSdata(e.target.value)}
      />
      <input
        type="text"
        placeholder="Quality Check"
        value={qdata}
        onChange={(e) => setQdata(e.target.value)}
      />
      <button onClick={() => updateCropData("pesticideData", pdata)}>Update Pesticide Data</button>
      <button onClick={() => updateCropData("transportationStatus", tdata)}>
        Update Transportation Status
      </button>
      <button onClick={() => updateCropData("shelfLifeData", sdata)}>Update Shelf Life Data</button>
      <button onClick={() => updateCropData("qualityCheck", qdata)}>Update Quality Check</button>
      <br></br>
      <h2>Farmer details</h2>
      <input type="text" placeholder="address" value={farmer} onChange={(e)=> setFarmer(e.target.value)}></input>
      <button onClick={()=>farmer_info(farmer)}>Fetch Info</button>
      <button onClick={()=>distributor_info(farmer)}>Distributor Info</button>
      <button onClick={()=>merchant_info(farmer)}>Merchant Info</button>

      <h2>Crop Accounts</h2>
      <button onClick={()=>crop_acc(cropId)}>Crop Info</button>

      <h2>Give Access</h2>
      <input type="text" placeholder="address" value={user_add} onChange={(e)=> setUser_add(e.target.value)}></input>
      <button onClick={()=>allow_access(user_add)}>Allow</button>

      <h2>Access List</h2>

    </div>
    
  );
};

export default OwnerPage;
