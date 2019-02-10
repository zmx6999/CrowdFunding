import web3 from '../utils/initweb3'
import {crowdFundingFactoryInstance,getCrowdFundingInstance} from "./contracts"

const getAccounts = () => new Promise(async (resolve,reject) => {
    try {
        let r = await web3.eth.getAccounts()
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const getFundingList = (x = 0) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let _contractList = []
        if (x == 1) {
            _contractList = await crowdFundingFactoryInstance.methods.getCreatorFundingList(accounts[0]).call()
        } else if (x == 2) {
            _contractList = await crowdFundingFactoryInstance.methods.getInvestorFundingList(accounts[2]).call()
        } else {
            _contractList = await crowdFundingFactoryInstance.methods.getFundingList().call()
        }
        let contractPromise = _contractList.map(address => getFundingDetail(address))
        let contractList = Promise.all(contractPromise)
        resolve(contractList)
    } catch (e) {
        reject(e)
    }
})

const getFundingDetail = address => new Promise(async (resolve,reject) => {
    try {
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let name = await instance.methods.name().call()
        let targetMoney = await instance.methods.targetMoney().call()
        let supportMoney = await instance.methods.supportMoney().call()
        let investorCount = await instance.methods.getInvestorCount().call()
        let endTime = await instance.methods.getTimeLeft().call()
        let balance = await instance.methods.getBalance().call()
        resolve({address,name,targetMoney,supportMoney,investorCount,endTime,balance})
    } catch (e) {
        reject(e)
    }
})

const newFunding = (name,targetMoney,supportMoney,duration) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let r = await crowdFundingFactoryInstance.methods.createCrowdFunding(name,targetMoney,supportMoney,duration).send({from:accounts[1],gas:3000000})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const support = (address,supportMoney) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let r = await instance.methods.support().send({from:accounts[2],gas:3000000,value:supportMoney})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const createRequest = (address,purpose,to,amount) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let r = await instance.methods.createRequest(purpose,to,amount).send({from:accounts[0],gas:3000000})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const approveRequest = (address,requestId) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let r = await instance.methods.approveRequest(requestId).send({from:accounts[2],gas:3000000})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const finalizeRequest = (address,requestId) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let r = await instance.methods.finalizeRequest(requestId).send({from:accounts[2],gas:3000000})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

const getRequestList = address => new Promise(async (resolve,reject) => {
    try {
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let requestCount = await instance.methods.getRequestCount().call()
        let requestList = []
        for (let i=0;i<requestCount;i++) {
            let request = await getRequest(address,i)
            requestList.push(request)
        }
        resolve(requestList)
    } catch (e) {
        reject(e)
    }
})

const getRequest = (address,requestId) => new Promise(async (resolve,reject) => {
    try {
        let accounts = await getAccounts()
        let instance = getCrowdFundingInstance()
        instance.options.address = address
        let r = await instance.methods.getRequest(requestId).call({from:accounts[2]})
        resolve(r)
    } catch (e) {
        reject(e)
    }
})

export {getAccounts,getFundingList,getFundingDetail,newFunding,support,createRequest,approveRequest,finalizeRequest,getRequestList}
