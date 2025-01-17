import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./component/Web3Context";
import HomePage from "./component/home";
import FarmerPage from "./component/farmer";
import DistributorPage from "./component/distributer";
import MerchantPage from "./component/marchent";
import OwnerPage from "./component/owner";
import ConsumerPage from "./component/consumer";


const App = () => {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/farmer" element={<FarmerPage />} />
          <Route path="/distributor" element={<DistributorPage />} />
          <Route path="/merchant" element={<MerchantPage />} />
          <Route path="/owner" element={<OwnerPage />} />
          <Route path="/consumer" element={<ConsumerPage />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
};

export default App;
