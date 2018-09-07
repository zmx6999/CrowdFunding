pragma solidity ^0.4.4;


contract Funding {
    string fundingName;
    uint goalPrice;
    uint supportPrice;
    uint endtime;
    address manager;
    address[] players;
    mapping(address=>bool) hasPlayer;
    
    struct Request {
        uint price;
        address to;
        string desc;
        mapping(address=>bool) approved;
        uint approveNum;
        bool complete;
    }
    Request[] requests;
    
    function Funding(string _fundingName,uint _goalPrice,uint _supportPrice) {
        fundingName=_fundingName;
        goalPrice=_goalPrice;
        supportPrice=_supportPrice;
        manager=msg.sender;
        endtime=now+4 weeks;
    }
    
    function enter() payable public onlyPlayer {
        require(msg.value==supportPrice);
        players.push(msg.sender);
        hasPlayer[msg.sender]=true;
    }
    
    function makeRequest(uint price,address to,string desc) public onlyManager {
        Request memory request=Request({
            price:price,
            to:to,
            desc:desc,
            complete:false,
            approveNum:0
        });
        requests.push(request);
    } 
    
    function approveRequest(uint id) public onlyPlayer {
        Request storage request=requests[id];
        require(hasPlayer[msg.sender]);
        require(!request.approved[msg.sender]);
        request.approveNum+=1;
        request.approved[msg.sender]=true;
    }
    
    function finalizeRequest(uint id) public onlyManager {
        Request storage request=requests[id];
        require(!request.complete);
        require(request.approveNum*2>players.length);
        require(this.balance>=request.price);
        request.to.transfer(request.price);
        request.complete=true;
    }
    
    modifier onlyManager() {
        require(msg.sender==manager);
        _;
    }
    
    modifier onlyPlayer() {
        require(msg.sender!=manager);
        _;
    }
    
    function getFunding() view public returns (string,uint,uint,uint,address) {
        return (fundingName,goalPrice,supportPrice,endtime,manager);
    }
}