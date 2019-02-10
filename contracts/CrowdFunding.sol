pragma solidity ^0.4.0;
import "./InvestorFunding.sol";

contract CrowdFunding {
    string public name;
    uint public targetMoney;
    uint public supportMoney;
    uint public endTime;
    address public creator;

    address[] investors;
    mapping(address=>bool) voted;
    mapping(address=>bool) returned;

    struct Request {
        string purpose;
        address to;
        uint amount;
        uint approveCount;
        RequestStatus status;
        mapping(address=>bool) approved;
    }

    enum RequestStatus {Voting,Complete}

    Request[] requests;

    InvestorFunding i2f;

    //constructor(string _name,uint _targetMoney,uint _supportMoney,uint duration) {
    constructor(string _name,uint _targetMoney,uint _supportMoney,uint duration,address _creator,InvestorFunding _i2f) {
        name=_name;
        targetMoney=_targetMoney;
        supportMoney=_supportMoney;
        endTime=now+duration;
        //creator=msg.sender;
        creator=_creator;
        i2f=_i2f;
    }

    modifier onlyCreator() {
        require(msg.sender==creator);
        _;
    }

    function support() payable public {
        require(msg.sender!=creator);
        require(msg.value==supportMoney);
        require(!voted[msg.sender]);
        investors.push(msg.sender);
        voted[msg.sender]=true;
        i2f.join(msg.sender,address(this));
    }

    function returnMoney() public onlyCreator {
        require(address(this).balance>=supportMoney*investors.length);
        for(uint i=0;i<investors.length;i++) {
            if(!returned[investors[i]]) investors[i].transfer(supportMoney);
            returned[investors[i]]=true;
        }
    }

    function createRequest(string purpose,address to,uint amount) public onlyCreator {
        requests.push(Request({purpose:purpose,to:to,amount:amount,approveCount:0,status:RequestStatus.Voting}));
    }

    function approveRequest(uint requestId) public {
        require(voted[msg.sender]);
        Request storage request=requests[requestId];
        require(!request.approved[msg.sender]);
        require(request.status==RequestStatus.Voting);
        request.approveCount+=1;
        request.approved[msg.sender]=true;
    }

    function finalizeRequest(uint requestId) public onlyCreator {
        Request storage request=requests[requestId];
        require(request.status==RequestStatus.Voting);
        require(request.approveCount*2>investors.length);
        request.status=RequestStatus.Complete;
        if(request.amount>0) request.to.transfer(request.amount);
    }

    function getInvestors() public view returns (address[]) {
        return investors;
    }

    function getInvestorCount() public view returns (uint) {
        return investors.length;
    }

    function getRequest(uint requestId) public view returns (string,address,uint,uint,uint,bool) {
        Request request=requests[requestId];
        return (request.purpose,request.to,request.amount,request.approveCount,uint(request.status),request.approved[msg.sender]);
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

    function getTimeLeft() public view returns (uint) {
        if(endTime<now) return 0;
        return endTime-now;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
