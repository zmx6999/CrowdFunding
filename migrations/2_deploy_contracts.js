var Funding = artifacts.require("./Funding.sol");
module.exports = function(deployer) {
    deployer.deploy(Funding,web3.toWei(10,"ether"),60)
}
