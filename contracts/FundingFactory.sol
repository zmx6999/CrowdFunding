pragma solidity ^0.4.24;
import "./Funding.sol";

contract FundingFactory {
    address public platformCreator;
    address[] public fundingContracts;
    mapping(address=>address[]) public creatorFunding;

    InvestorFunding i2f;

    constructor() public {
        platformCreator=msg.sender;
        address i2fAddress=new InvestorFunding();
        i2f=InvestorFunding(i2fAddress);
    }

    function newFunding(string _name,uint _targetMoney,uint _supportMoney,uint duration) public {
        address fundingAddress=new Funding(_name,_targetMoney,_supportMoney,duration,msg.sender,i2f);
        fundingContracts.push(fundingAddress);
        creatorFunding[msg.sender].push(fundingAddress);
    }

    function getFundingContracts() public view returns (address[]) {
        return fundingContracts;
    }

    function getCreatorFunding(address creator) public view returns (address[]) {
        return creatorFunding[creator];
    }

    function getInvestorFunding(address investor) public view returns (address[]) {
        return i2f.getInvestorFunding(investor);
    }
}