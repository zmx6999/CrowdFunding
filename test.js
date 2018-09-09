const Funding=artifacts.require("./Funding.sol")
module.exports=function () {
    var instance
    Funding.deployed().then(function (i) {
        instance=i
        //instance.support({from:web3.eth.accounts[0],value:web3.toWei(2,"ether")})
        //instance.support({from:web3.eth.accounts[1],value:web3.toWei(3,"ether")})
        //instance.support({from:web3.eth.accounts[2],value:web3.toWei(2,"ether")})
        //instance.finalize({from:web3.eth.accounts[0]})
        /*console.log(web3.eth.getBalance(web3.eth.accounts[0]))
        console.log(web3.eth.getBalance(web3.eth.accounts[1]))
        console.log(web3.eth.getBalance(web3.eth.accounts[2]))
        console.log(web3.eth.getBalance(web3.eth.accounts[3]))
        console.log(web3.eth.getBalance(web3.eth.accounts[4]))
        instance.getBalance.call().then(function (r) {
            console.log(r)
        })*/
        //instance.makeRequest(web3.toWei(3,"ether"),web3.eth.accounts[4],"buy something",{from:web3.eth.accounts[0]})
        //instance.approveRequest(0,{from:web3.eth.accounts[1]})
        //instance.approveRequest(0,{from:web3.eth.accounts[2]})
        //instance.finalizeRequest(0,{from:web3.eth.accounts[0]})
        /*instance.getRequest.call(0).then(function (r) {
            console.log(r)
        })
        console.log(web3.eth.accounts[4])*/
    })
}
