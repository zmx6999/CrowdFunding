const Funding=artifacts.require("./Funding.sol")
module.exports=function () {
    var instance
    Funding.deployed().then(function (i) {
        instance=i
        /*instance.getFunding.call().then(function (r) {
            console.log(r)
        })
        console.log(web3.eth.accounts[0])*/
        /*for (let i=1; i<=5;i++) {
            instance.enter({from:web3.eth.accounts[i],value:web3.toWei(2,"ether"),gas:1000000})
        }*/
        //instance.makeRequest(web3.toWei(5,"ether"),web3.eth.accounts[6],"buy something",{from:web3.eth.accounts[0],gas:1000000})
        //instance.approveRequest(0,{from:web3.eth.accounts[1],gas:1000000})
        //instance.approveRequest(0,{from:web3.eth.accounts[2],gas:1000000})
        //instance.approveRequest(0,{from:web3.eth.accounts[3],gas:1000000})
        //instance.finalizeRequest(0,{from:web3.eth.accounts[0],gas:1000000})
        //for (let i=0;i<=6;i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))
    })
}