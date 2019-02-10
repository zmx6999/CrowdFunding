var CrowdFundingFactory = artifacts.require("./CrowdFundingFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(CrowdFundingFactory);
};
