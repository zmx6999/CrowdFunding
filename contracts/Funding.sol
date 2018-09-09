pragma solidity ^0.4.4;

contract Funding {
    uint goal;
    uint amountRaised;
    uint endtime;
    
    address manager;
    address[] players;
    mapping(address=>uint) playerSupport;
    
    bool end;
    bool goalReached;
    
    function Funding(uint _goal,uint duration) {
        goal=_goal;
        endtime=now+duration;
        manager=msg.sender;
        end=false;
        goalReached=false;
    }
    
    modifier onlyPlayer() {
        require(msg.sender!=manager);
        _;
    }
    
    modifier onlyManager() {
        require(msg.sender==manager);
        _;
    }
    
    modifier beforeEndtime() {
        require(now<=endtime);
        _;
    }
    
    modifier afterEndtime() {
        require(now>endtime);
        _;
    }
    
    modifier onlyGoalReached() {
        require(goalReached);
        _;
    }
    
    modifier notFinish(uint id) {
        Request memory request=requests[id];
        require(!request.finish);
        _;
    }
    
    function support() payable public onlyPlayer beforeEndtime {
        if(playerSupport[msg.sender]==0) players.push(msg.sender);
        playerSupport[msg.sender]+=msg.value;
        amountRaised+=msg.value;
    }
    
    function finalize() public afterEndtime {
        require(!end);
        if(amountRaised>=goal) {
            end=true;
            goalReached=true;
        } else {
            for(uint i=0;i<players.length;i++)
                if(playerSupport[players[i]]>0) players[i].transfer(playerSupport[players[i]]);
            end=true;
            goalReached=false;
        }
    }
    
    struct Request {
        uint amount;
        address to;
        string intro;
        bool finish;
        uint approveNum;
        mapping(address=>bool) playerApprove;
    }
    Request[] requests;
    
    function makeRequest(uint _amount,address _to,string _intro) public onlyGoalReached onlyManager {
        requests.push(Request({
            amount:_amount,
            to:_to,
            intro:_intro,
            finish:false,
            approveNum:0
        }));
    }
    
    function approveRequest(uint id) public onlyGoalReached onlyPlayer notFinish(id) {
        require(playerSupport[msg.sender]>0);
        Request storage request=requests[id];
        require(!request.playerApprove[msg.sender]);
        request.approveNum+=1;
        request.playerApprove[msg.sender]=true;
    }
    
    function finalizeRequest(uint id) public onlyGoalReached onlyManager notFinish(id) {
        Request storage request=requests[id];
        require(request.approveNum*2>players.length);
        request.to.transfer(request.amount);
        request.finish=true;
    }
    
    function getRequest(uint id) view public returns (uint,address,uint,string) {
        Request memory request=requests[id];
        return (request.amount,request.to,request.approveNum,request.intro);
    }
    
    function getBalance() view public returns (uint) {
        return this.balance;
    }
}