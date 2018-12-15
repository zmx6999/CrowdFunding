pragma solidity ^0.4.24;
import "./InvestorFunding.sol";

contract Funding {
    string public name;
    uint public targetMoney;
    uint public supportMoney;
    uint public endTime;
    address public creator;

    address[] public investors;
    mapping(address=>bool) public invested;
    mapping(address=>bool) public returned;

    struct Request {
        string purpose;
        address to;
        uint cost;
        uint approvedCount;
        mapping(address=>bool) approved;
        RequestStatus status;
    }

    enum RequestStatus {Voting,Complete}

    Request[] requests;

    InvestorFunding i2f;

    constructor(string _name,uint _targetMoney,uint _supportMoney,uint duration,address _creator,InvestorFunding _i2f) public {
        name=_name;
        targetMoney=_targetMoney;
        supportMoney=_supportMoney;
        endTime=now+duration;
        creator=_creator;
        i2f=_i2f;
    }

    modifier onlyCreator() {
        require(msg.sender==creator);
        _;
    }

    modifier onlyInvestor() {
        require(msg.sender!=creator);
        _;
    }

    function invest() payable public onlyInvestor {
        require(msg.value==supportMoney);
        require(!invested[msg.sender]);
        investors.push(msg.sender);
        invested[msg.sender]=true;
        i2f.join(msg.sender,this);
    }

    function drawback() public onlyCreator {
        require(address(this).balance>=supportMoney*investors.length);
        for(uint i=0;i<investors.length;i++) {
            if(!returned[investors[i]]) {
                investors[i].transfer(supportMoney);
                returned[investors[i]]=true;
            }
        }
    }

    function createRequest(string purpose,address to,uint cost) public onlyCreator {
        requests.push(Request({purpose:purpose,to:to,cost:cost,approvedCount:0,status:RequestStatus.Voting}));
    }

    function approve(uint index) public onlyInvestor {
        require(invested[msg.sender]);
        Request request=requests[index];
        require(!request.approved[msg.sender]);
        require(request.status==RequestStatus.Voting);
        request.approvedCount++;
        request.approved[msg.sender]=true;
    }

    function finalize(uint index) public onlyCreator {
        Request request=requests[index];
        require(request.approvedCount*2>investors.length);
        require(request.status==RequestStatus.Voting);
        request.to.transfer(request.cost);
        request.status=RequestStatus.Complete;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

    function getRequest(uint index) public view returns (string,address,uint,uint,bool,uint) {
        Request request=requests[index];
        return (request.purpose,request.to,request.cost,request.approvedCount,request.approved[msg.sender],uint(request.status));
    }

    function getInvestorsCount() public view returns (uint) {
        return investors.length;
    }

    function getInvestors() public view returns (address[]) {
        return investors;
    }

    function getExtraTime() public view returns (uint) {
        if(now>endTime) return 0;
        return endTime-now;
    }
}