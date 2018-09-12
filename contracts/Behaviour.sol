pragma solidity ^0.4.24;

// @girish979

library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}



contract Behaviour {

  using SafeMath for uint;

  bool public isLocked = true;
  address owner;


  //Holds the actual value
  //1-10
  //1-Lowest; 10-Highest
  mapping (address => uint) public PlayerBehaviour;

  struct behaviour{
      uint[50] behaviours;
      uint8 count;
      mapping (address => bool) giver; 
      mapping (uint8 => address) giverReverseMapping;
  
  }

  //Receive 50 ratings from other players
  mapping (address => behaviour) public pendingPlayerBehaviours;



  event NewPendingRating (address giver, address receiver, uint8 rating);
  event NewRating (address player, uint rating);


  modifier onlyOwner () {
    require (msg.sender == owner);
    _;
  }

  modifier onlyUnlocked () {
    require (!isLocked);
    _;
  }

  constructor () public {
    owner = msg.sender;
  }
  
  function min (uint a, uint b) pure internal returns (uint) {
    if (a <= b) return a;
    return b;
  }
  
  function max (uint a, uint b) pure internal returns (uint) {
    if (a >= b) return a;
    return b;
  }
  
  function lockContract () public onlyOwner {
    isLocked = true;
  }
  
  function unlockContract () public onlyOwner {
    isLocked = false;
  }
  
  
  function getRating(address player) public returns (uint rating)
  {
       //Un-initialized
    if(PlayerBehaviour[player] == 0 && pendingPlayerBehaviours[player].count==0)
    {
        //Set to avg
        PlayerBehaviour[player] = 5;
    }

    rating = PlayerBehaviour[player];
  }

  
  function ratebehaviour (address receiver, uint8 rating) public onlyUnlocked {

    //Un-initialized
    if(PlayerBehaviour[receiver] == 0 && pendingPlayerBehaviours[receiver].count==0)
    {
        //Set to avg
        PlayerBehaviour[receiver] = 5;
    }
    

    //if not given
    if(pendingPlayerBehaviours[receiver].giver[msg.sender] == false)
    {
        pendingPlayerBehaviours[receiver].count = pendingPlayerBehaviours[receiver].count+1;
        pendingPlayerBehaviours[receiver].giver[msg.sender] = true;
        pendingPlayerBehaviours[receiver].giverReverseMapping[pendingPlayerBehaviours[receiver].count] = msg.sender;
        pendingPlayerBehaviours[receiver].behaviours[pendingPlayerBehaviours[receiver].count] = rating;

        emit NewPendingRating (msg.sender, receiver, rating);

        //Update the rating at 50 count, and reset all  pending behaviour to 0
        if(pendingPlayerBehaviours[receiver].count == 50)
        {
            uint pendingAvg = 0;
            for (uint i = 1; i <= 50; i++) {
                pendingAvg = pendingAvg+pendingPlayerBehaviours[receiver].behaviours[i];
            }
            pendingAvg = pendingAvg.div(50);
            pendingAvg = pendingAvg + PlayerBehaviour[receiver];
            pendingAvg = pendingAvg.div(2);

            PlayerBehaviour[receiver] = pendingAvg;

            //Reset rating, count and givers
            for (uint8 j = 1; j <= 50; j++) {
                pendingPlayerBehaviours[receiver].behaviours[j] = 0;
                address givenplayer = pendingPlayerBehaviours[receiver].giverReverseMapping[j];
                pendingPlayerBehaviours[receiver].giver[givenplayer] = false;
                pendingPlayerBehaviours[receiver].giverReverseMapping[j] = 0;
            }
            pendingPlayerBehaviours[receiver].count = 0;
            emit NewRating (receiver,  PlayerBehaviour[receiver]);

        }
        
        
    }

    
  }
  

}