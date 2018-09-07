var Funding = artifacts.require("./Funding.sol");
module.exports = function(deployer) {
    deployer.deploy(Funding,"funding180907",web3.toWei(10,"ether"),web3.toWei(2,"ether"),{gas:1000000})
}