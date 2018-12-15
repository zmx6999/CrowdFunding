pragma solidity ^0.4.24;

contract InvestorFunding {
    mapping(address=>address[]) public investorFunding;

    function join(address investor,address funding) public {
        investorFunding[investor].push(funding);
    }

    function getInvestorFunding(address investor) public view returns (address[]) {
        return investorFunding[investor];
    }
}
