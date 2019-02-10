pragma solidity ^0.4.0;

contract InvestorFunding {
    mapping(address=>address[]) investorFundingList;

    function getInvestorFundingList(address investor) public view returns (address[]) {
        return investorFundingList[investor];
    }

    function join(address investor,address funding) public {
        investorFundingList[investor].push(funding);
    }
}
