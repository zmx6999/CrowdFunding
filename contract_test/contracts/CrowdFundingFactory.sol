pragma solidity ^0.4.0;
import "./CrowdFunding.sol";
import "./InvestorFunding.sol";

contract CrowdFundingFactory {
    address[] fundingList;
    mapping(address=>address[]) creatorFundingList;
    InvestorFunding i2f;

    constructor() {
        address i2fAddress=new InvestorFunding();
        i2f=InvestorFunding(i2fAddress);
    }

    function createCrowdFunding(string name,uint targetMoney,uint supportMoney,uint duration) public {
        CrowdFunding crowdFunding=new CrowdFunding(name,targetMoney,supportMoney,duration,msg.sender,i2f);
        fundingList.push(address(crowdFunding));
        creatorFundingList[msg.sender].push(address(crowdFunding));
    }

    function getFundingList() public view returns (address[]) {
        return fundingList;
    }

    function getCreatorFundingList(address creator) public view returns (address[]) {
        return creatorFundingList[creator];
    }

    function getInvestorFundingList(address investor) public view returns (address[]) {
        return i2f.getInvestorFundingList(investor);
    }
}
