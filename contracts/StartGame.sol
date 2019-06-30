pragma solidity ^0.5.0;

import "./Hangman.sol";
import "chainlink/contracts/ChainlinkClient.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract StartGame is ChainlinkClient, Ownable {
    string public url;
    string public path;
    address public oracleAddr;
    bytes32 public constant CHAINLINK_JOB_ID = "013f25963613411badc2ece3a92d0800";

    constructor(address _link, address _oracle, string _url, string _path) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        url = _url;
        path = _path;
    }

    function createWordRequest(uint256 payment) internal returns (bytes32) {
        // newRequest takes a JobID, a callback address, and callback function as input
        Chainlink.Request memory req = buildChainlinkRequest(CHAINLINK_JOB_ID, this, this.fulfill.selector);
        req.add("url", url);
        req.add("path", path);
        bytes32 requestId = sendChainlinkRequestTo(chainlinkOracleAddress(), req, payment);
        return requestId;
    }

    function fulfill(bytes32 _requestId, bytes32 _data)
        public
        recordChainlinkFulfillment(_requestId)
        returns (bytes32) {
        return _data;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function setUrl(string _url) public onlyOwner {
        url = _url;
    }

    function cancelRequest(bytes32 _requestId, uint256 _payment, bytes4 _callbackFunctionId, uint256 _expiration) public onlyOwner {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    function createHangmanContract() public returns (address) {
        bytes memory word = "cheese";
        Hangman game = new Hangman(word , word.length);
        game.transferOwnership(msg.sender);
        return address(game);
    }
}
