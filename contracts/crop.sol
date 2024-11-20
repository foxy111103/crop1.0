// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropSupplyChain {
    enum Role { None, Farmer, Distributor, Merchant }
    enum CropStatus { Pending, Approved, Rejected }
    string public storedData;
    //crop structure
    struct Crop {
        uint256 id;
        address farmer;
        address distributor;
        address merchant;
        uint256 healthScore; 
        CropStatus status;
    }

    mapping(uint256 => Crop) public crops;
    mapping(address => Role) public roles;
    uint256 public cropCount = 0;
    uint256 public constant MIN_HEALTH_SCORE = 70; 
    uint256 public rewardAmount = 0.001 ether; 

    
    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Unauthorized: Wrong role");
        _;
    }

    modifier cropExists(uint256 _cropId) {
        require(_cropId <= cropCount, "Crop does not exist");
        _;
    }

    
    function registerRole(Role _role) external {
        require(roles[msg.sender] == Role.None, "Role already assigned");
        roles[msg.sender] = _role;
    }

    
    function createCrop(uint256 _healthScore) external onlyRole(Role.Farmer) returns (uint256) {
        cropCount++;
        crops[cropCount] = Crop(cropCount, msg.sender, address(0), address(0), _healthScore, CropStatus.Pending);
        return cropCount;
    }

    // Distributor verifies crop quality
    function verifyCropByDistributor(uint256 _cropId) external onlyRole(Role.Distributor) cropExists(_cropId) {
        Crop storage crop = crops[_cropId];
        require(crop.status == CropStatus.Pending, "Crop already verified");
        crop.distributor = msg.sender;

        if (crop.healthScore >= MIN_HEALTH_SCORE) {
            crop.status = CropStatus.Approved;
            payable(crop.farmer).transfer(rewardAmount);
        } else {
            crop.status = CropStatus.Rejected;
        }
    }

    // Merchant finalizes the crop quality check
    function verifyCropByMerchant(uint256 _cropId) external onlyRole(Role.Merchant) cropExists(_cropId) {
        Crop storage crop = crops[_cropId];
        require(crop.status == CropStatus.Approved, "Crop is not approved for merchant verification");
        crop.merchant = msg.sender;

        if (crop.healthScore >= MIN_HEALTH_SCORE) {
            payable(crop.distributor).transfer(rewardAmount);
        }
    }

    // Deposit funds to the contract for rewards
    function depositFunds() external  payable {
    
    }
    function getAmt()public view returns(uint){
        return address(this).balance;
    }

   
    function getCrop(uint256 _cropId) external view cropExists(_cropId) returns (
        uint256, address, address, address, uint256, CropStatus
    ) {
        Crop memory crop = crops[_cropId];
        return (crop.id, crop.farmer, crop.distributor, crop.merchant, crop.healthScore, crop.status);
    }

    function setData(string memory data) public {
        storedData = data;
    }

    function getData() public view returns (string memory) {
        return storedData;
    }
    
}
