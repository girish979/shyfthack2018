pragma solidity ^0.4.18;

import "./ERC721.sol";

contract GameObject is ERC721 {
    /*** CONSTANTS ***/

    string public constant name = "GameObject";
    string public constant symbol = "1337";
    bytes4 constant InterfaceID_ERC165 =
        bytes4(keccak256('supportsInterface(bytes4)'));

    bytes4 constant InterfaceID_ERC721 =
        bytes4(keccak256('name()')) ^
        bytes4(keccak256('symbol()')) ^
        bytes4(keccak256('totalSupply()')) ^
        bytes4(keccak256('balanceOf(address)')) ^
        bytes4(keccak256('ownerOf(uint256)')) ^
        bytes4(keccak256('approve(address,uint256)')) ^
        bytes4(keccak256('transfer(address,uint256)')) ^
        bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        bytes4(keccak256('tokensOfOwner(address)'));


    /*** DATA TYPES ***/

    struct Item {

        address achievedBy;
        uint64 achievedAt;
        uint256 itemtype;
        uint256 rarity;
        uint256 points;
        uint256 id;


    }


    /*** STORAGE ***/

    Item[] items;

    mapping(uint256 => address) public tokenIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;
    mapping(uint256 => address) public tokenIndexToApproved;


    /*** EVENTS ***/

    event Mint(address owner, uint256 itemId);


    /*** INTERNAL FUNCTIONS ***/

    function _owns(address _claimant, uint256 _itemid) internal view returns(bool) {
        return tokenIndexToOwner[_itemid] == _claimant;
    }

    function _approvedFor(address _claimant, uint256 _itemid) internal view returns(bool) {
        return tokenIndexToApproved[_itemid] == _claimant;
    }

    function _approve(address _to, uint256 _itemid) internal {
        tokenIndexToApproved[_itemid] = _to;

        emit Approval(tokenIndexToOwner[_itemid], tokenIndexToApproved[_itemid], _itemid);
    }

    function _transfer(address _from, address _to, uint256 _itemid) internal {
        ownershipTokenCount[_to]++;
        tokenIndexToOwner[_itemid] = _to;

        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            delete tokenIndexToApproved[_itemid];
        }

        emit Transfer(_from, _to, _itemid);
    }

    function _item(address _owner) internal returns(uint256 itemId) {
        Item memory item = Item({
            achievedBy: _owner,
            achievedAt: uint64(now),
            itemtype: uint64(1),
            rarity: uint64(1),
            points: uint64(1),
            id: uint64(1)



        });
        itemId = items.push(item) - 1;

        emit Mint(_owner, itemId);

        _transfer(0, _owner, itemId);
    }


    /*** ERC721 IMPLEMENTATION ***/

    function supportsInterface(bytes4 _interfaceID) external view returns(bool) {
        return ((_interfaceID == InterfaceID_ERC165) || (_interfaceID == InterfaceID_ERC721));
    }

    function totalSupply() public view returns(uint256) {
        return items.length;
    }

    function balanceOf(address _owner) public view returns(uint256) {
        return ownershipTokenCount[_owner];
    }

    function ownerOf(uint256 _itemid) external view returns(address owner) {
        owner = tokenIndexToOwner[_itemid];

        require(owner != address(0));
    }

    function approve(address _to, uint256 _itemid) external {
        require(_owns(msg.sender, _itemid));

        _approve(_to, _itemid);
    }

    function transfer(address _to, uint256 _itemid) external {
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(msg.sender, _itemid));

        _transfer(msg.sender, _to, _itemid);
    }

    function transferFrom(address _from, address _to, uint256 _itemid) external {
        require(_to != address(0));
        require(_to != address(this));
        require(_approvedFor(msg.sender, _itemid));
        require(_owns(_from, _itemid));

        _transfer(_from, _to, _itemid);
    }

    function tokensOfOwner(address _owner) external view returns(uint256[]) {
        uint256 balance = balanceOf(_owner);

        if (balance == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](balance);
            uint256 maxTokenId = totalSupply();
            uint256 idx = 0;

            uint256 itemId;
            for (itemId = 1; itemId <= maxTokenId; itemId++) {
                if (tokenIndexToOwner[itemId] == _owner) {
                    result[idx] = itemId;
                    idx++;
                }
            }
        }

        return result;
    }


    /*** OTHER EXTERNAL FUNCTIONS ***/

    function generateitem() external returns(uint256) {
        return _item(msg.sender);
    }

    function getItem(uint256 _itemid) external view returns(address achievedBy, uint64 achievedAt, uint256 itemtype, uint256 rarity, uint256 points, uint256 id ) {
        Item memory item = items[_itemid];

        achievedBy = item.achievedBy;
        achievedAt = item.achievedAt;
        itemtype = item.itemtype;
        rarity = item.rarity;
        points = item.points;
        id = item.id;
    }
}
