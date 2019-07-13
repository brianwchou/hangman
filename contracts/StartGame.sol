pragma solidity ^0.4.24;

import "./Hangman.sol";
import "chainlink/contracts/ChainlinkClient.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract StartGame is ChainlinkClient, Ownable {
    struct Game {
        address player;
        address game;
    }

    string public url;
    string public path;
    address public oracleAddr;
    bytes32 public constant CHAINLINK_JOB_ID = "013f25963613411badc2ece3a92d0800";
    mapping(bytes32 => GameRequest) public requestIdToGame;

    //map job id to game struct
    //game struct will have address of the owner of that game and the hangman address

    constructor(address _link, address _oracle, string _url, string _path) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        url = _url;
        path = _path;
    }

    function requestStartGame(uint256 payment) public returns (bytes32) {
        // newRequest takes a JobID, a callback address, and callback function as input
        Chainlink.Request memory req = buildChainlinkRequest(CHAINLINK_JOB_ID, this, this.fullfillStartGame.selector);
        req.add("url", url);
        req.add("path", path);
        bytes32 requestId = sendChainlinkRequest(req, payment);
        //requestId will point to the player and the game address(which is pending)
        requestIdToGame[requestId] = Game(msg.sender, address(0));
        //return request id as to check if we've gotten a game back
        return requestId;
    }

    function fullfillStartGame(bytes32 _requestId, bytes32 _data)
        public
        recordChainlinkFulfillment(_requestId)
        returns (bytes32) {
            require(requestIdToGame[_requestId] != 0, "Id does not exist");

            //get the game instance
            Game storage gameInstance = requestIdToGame[_requestId];
            //create the new hangman with the word(data)
            Hangman game = new Hangman(_data, _data.length);
            //save game into the request
            gameInstance.game = game;
            //update the owner of the game
            game.transferOwnership(gameInstance.player);
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
}
