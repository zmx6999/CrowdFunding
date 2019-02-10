/*const Web3=require('web3')
const ganache=require('ganache-cli')
const web3=new Web3(ganache.provider())
const {bytecode,interface}=require('../compile/CrowdFunding')
const assert=require('assert')
const wait=t => {
    let t1=parseFloat(new Date()/1000)
    let t2
    while (true) {
        t2=parseFloat(new Date()/1000)
        if(t2-t1>=t) return
    }
}
const arrayEqual=(a1,a2) => {
    if (a1.length!=a2.length) return false
    for (let i=0;i<a2.length;i++) {
        if (a1[i]!=a2[i]) return false
    }
    return true
}
let accounts
let instance
beforeEach(async () => {
    accounts=await web3.eth.getAccounts()
    let now=parseInt(new Date()/1000)
    instance=await new web3.eth.Contract(JSON.parse(interface)).deploy({data:bytecode,arguments:['AI Research',web3.utils.toWei('3','ether'),web3.utils.toWei('1','ether'),60]}).send({from:accounts[0],gas:3000000})
})
describe('CrowdFunding',() => {
    it('support investor',async () => {
        await instance.methods.support().send({from:accounts[0],gas:3000000,value:web3.utils.toWei('1','ether')})
    })

    it('support money',async () => {
        await instance.methods.support().send({from:accounts[1],gas:3000000,value:web3.utils.toWei('0.1','ether')})
    })

    it('support money2',async () => {
        await instance.methods.support().send({from:accounts[1],gas:3000000})
    })

    it('support repeat',async () => {
        await instance.methods.support().send({from:accounts[1],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.support().send({from:accounts[1],gas:3000000,value:web3.utils.toWei('1','ether')})
    })

    it('returnMoney onlyCreator',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.returnMoney().send({from:accounts[1],gas:3000000})
    })

    it('returnMoney repeat',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.returnMoney().send({from:accounts[0],gas:3000000})
        await instance.methods.returnMoney().send({from:accounts[0],gas:3000000})
    })

    it('createRequest onlyCreator',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[1],gas:3000000})
    })

    it('approveRequest investor',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        await instance.methods.approveRequest(0).send({from:accounts[0],gas:3000000})
    })

    it('approveRequest repeat',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        await instance.methods.approveRequest(0).send({from:accounts[1],gas:3000000})
        await instance.methods.approveRequest(0).send({from:accounts[1],gas:3000000})
    })

    it('approveRequest voting',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        for (let i=1;i<=2;i++) await instance.methods.approveRequest(0).send({from:accounts[i],gas:3000000})
        await instance.methods.finalizeRequest(0).send({from:accounts[0],gas:3000000})
        await instance.methods.approveRequest(0).send({from:accounts[3],gas:3000000})
    })

    it('finalizeRequest onlyCreator',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        for (let i=1;i<=2;i++) await instance.methods.approveRequest(0).send({from:accounts[i],gas:3000000})
        await instance.methods.finalizeRequest(0).send({from:accounts[3],gas:3000000})
    })

    it('finalizeRequest approved',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        await instance.methods.approveRequest(0).send({from:accounts[3],gas:3000000})
        await instance.methods.finalizeRequest(0).send({from:accounts[0],gas:3000000})
    })

    it('finalizeRequest repeat',async () => {
        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        for (let i=1;i<=2;i++) await instance.methods.approveRequest(0).send({from:accounts[i],gas:3000000})
        await instance.methods.finalizeRequest(0).send({from:accounts[0],gas:3000000})
        await instance.methods.finalizeRequest(0).send({from:accounts[0],gas:3000000})
    })

    it('support',async () => {
        let b={}
        for (let i=1;i<=4;i++) {
            b[i]=await web3.eth.getBalance(accounts[i])
            b[i]=web3.utils.fromWei(b[i],'ether')
            b[i]=parseFloat(b[i])
        }

        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.createRequest('buy computer',accounts[4],web3.utils.toWei('1.2','ether')).send({from:accounts[0],gas:3000000})
        for (let i=1;i<=2;i++) await instance.methods.approveRequest(0).send({from:accounts[i],gas:3000000})
        await instance.methods.finalizeRequest(0).send({from:accounts[0],gas:3000000})

        let r=await instance.methods.getBalance().call()
        assert(r,web3.utils.toWei('1.8','ether'),'')
        for (let i=1;i<=4;i++) {
            r=await web3.eth.getBalance(accounts[i])
            r=web3.utils.fromWei(r,'ether')
            r=parseFloat(r)
            if(i==4) {
                assert(r,b[i]+1.2,'')
            } else {
                assert(b[i]-1.1<r && r<b[i]-1,true,'')
            }
        }

        r=await instance.methods.getInvestors().call()
        assert(arrayEqual(r,[accounts[1],accounts[2],accounts[3]]),true,'')
        r=await instance.methods.getInvestorCount().call()
        assert(r,3,'')
        for (let i=1;i<=3;i++) {
            r=await instance.methods.getRequest(0).call({from:accounts[i]})
            assert(r[0],'buy computer','')
            assert(r[1],accounts[4],'')
            assert(r[2],web3.utils.toWei('1.2','ether'),'')
            assert(r[3],2,'')
            assert(r[4],1,'')
            if (i==3) {
                assert(r[5]+'','false','')
            } else {
                assert(r[5]+'','true','')
            }
        }
        r=await instance.methods.getRequestCount().call()
        assert(r,1,'')
        let now=parseInt(new Date()/1000)
        let endTime=await instance.methods.endTime().call()
        r=await instance.methods.getTimeLeft().call()
        assert(r,endTime-now,'')
        wait(61)
        r=await instance.methods.getTimeLeft().call()
        assert(r,0,'')
    })

    it('returnMoney',async () => {
        let b={}
        for (let i=1;i<=3;i++) {
            b[i]=await web3.eth.getBalance(accounts[i])
            b[i]=web3.utils.fromWei(b[i],'ether')
            b[i]=parseFloat(b[i])
        }

        for (let i=1;i<=3;i++) await instance.methods.support().send({from:accounts[i],gas:3000000,value:web3.utils.toWei('1','ether')})
        await instance.methods.returnMoney().send({from:accounts[0],gas:3000000})

        for (let i=1;i<=3;i++) {
            let r=await web3.eth.getBalance(accounts[i])
            r=web3.utils.fromWei(r,'ether')
            r=parseFloat(r)
            assert(b[i]-0.1<r && r<b[i],true,'')
        }
    })
})*/
