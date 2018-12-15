import {fundingFactoryContract,fundingContract} from "./contracts"
import web3 from "../utils/initweb3"
const getFundingList=(x=0) => new Promise(async (resolve, reject) => {
    try {
        let _contracts=[]
        if (x==1) {
            let accounts=await web3.eth.getAccounts()
            _contracts=await fundingFactoryContract.methods.getCreatorFunding(accounts[0]).call()
        } else if (x==2) {
            let accounts=await web3.eth.getAccounts()
            _contracts=await fundingFactoryContract.methods.getInvestorFunding(accounts[0]).call()
        } else {
            _contracts=await fundingFactoryContract.methods.getFundingContracts().call()
        }
        let contractsPromise=_contracts.map(address => getFundingDetail(address))
        let contracts=Promise.all(contractsPromise)
        resolve(contracts)
    } catch (e) {
        reject(e)
    }
})

const getFundingDetail=(address) => new Promise(async (resolve, reject) => {
    try {
        let instance=fundingContract()
        instance.options.address=address
        let name=await instance.methods.name().call()
        let targetMoney=await instance.methods.targetMoney().call()
        let supportMoney=await instance.methods.supportMoney().call()
        let endTime=await instance.methods.getExtraTime().call()
        let investorCount=await instance.methods.getInvestorsCount().call()
        let balance=await instance.methods.getBalance().call()
        resolve({name,targetMoney,supportMoney,endTime,investorCount,balance,address})
    } catch (e) {
        reject(e)
    }
})

const newFunding=(name,targetMoney,supportMoney,duration) => new Promise(async (resolve, reject) => {
    try {
        let accounts=await web3.eth.getAccounts()
        let r=await fundingFactoryContract.methods.newFunding(name,targetMoney,supportMoney,duration).send({from:accounts[0]})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const invest=(address,supportMoney) => new Promise(async (resolve, reject) => {
    try {
        let instance=fundingContract()
        instance.options.address=address
        let accounts=await web3.eth.getAccounts()
        let r=await instance.methods.invest().send({from:accounts[0],value:supportMoney})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const createRequest=(address,purpose,to,cost) => new Promise(async (resolve, reject) => {
    try {
        let instance=fundingContract()
        instance.options.address=address
        let accounts=await web3.eth.getAccounts()
        let r=await instance.methods.createRequest(purpose,to,cost).send({from:accounts[0]})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const showRequests=(address) => new Promise(async (resolve, reject) => {
    try {
        let instance=fundingContract()
        instance.options.address=address
        let requestCount=await instance.methods.getRequestCount().call()
        console.log(requestCount)
        let accounts=await web3.eth.getAccounts()
        let requests=[]
        for (let i=0;i<requestCount;i++) {
            let request=await instance.methods.getRequest(i).call({from:accounts[0]})
            requests.push(request)
        }
        resolve(requests)
    } catch (e) {
        reject(e)
    }
})

const approve=(address,index) => new Promise(async (resolve, reject) => {
    try {
        let instance=fundingContract()
        instance.options.address=address
        let accounts=await web3.eth.getAccounts()
        let r=await instance.methods.approve(index).send({from:accounts[0]})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const finalize=(address,index) => new Promise(async (resolve, reject) => {
    try {
        let instance=fundingContract()
        instance.options.address=address
        let accounts=await web3.eth.getAccounts()
        let r=await instance.methods.finalize(index).send({from:accounts[0]})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

export {getFundingList,newFunding,invest,approve,finalize,createRequest,showRequests}