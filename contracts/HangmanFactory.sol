pragma solidity ^0.4.24;

import "./Hangman.sol";
import "chainlink/contracts/ChainlinkClient.sol";
import "link_token/contracts/token/linkERC20.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract HangmanFactory is ChainlinkClient, Ownable {
    struct Game {
        address player;
        Hangman game;
    }

    // the owner of the contract, the request id generated against that sender
    event RequestCreateGame(address owner, bytes32 requestId);
    event FulfillCreateGame(address owner, bytes32 requestId);

    string public url;
    string public path;
    address public linkToken;
    address public oracle;
    mapping(bytes32 => Game) public requestIdToGame;
    //map job id to game struct
    //game struct will have address of the owner of that game and the hangman address

    /*
     * @notice Initializes the StartGame contract
     * @param address the Chainlink Token address
     * @param address the Chainlink Oracle address
     * @param string the url that will be used to pull words from
     * @param string path the path in the returned result from url to grab the word
     */
    constructor(address _link, address _oracle, string _url, string _path) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        linkToken = _link;
        oracle = _oracle;
        url = _url;
        path = _path;
    }

    /*
     * @notice Requests to start a new hangman game
     * @dev remits requestId for a given sender
     * @param uint256 the payment to the oracle in order to fetch a random word
     */
    function requestCreateGame(bytes32 job_id, uint256 payment) public {
        // check that the user has enough LINK on account
        require(linkERC20(linkToken).balanceOf(msg.sender) >= payment, "User has insufficient LINK");

        //transfer LINK to this contract so it can request
        require(linkERC20(linkToken).transferFrom(msg.sender, this, payment), "Cannot tranfer LINK");

        // newRequest takes a JobID, a callback address, and callback function as input
        Chainlink.Request memory req = buildChainlinkRequest(job_id, this, this.fullfillCreateGame.selector);
        req.add("url", url);
        string[] memory p = new string[](3);
        p[0] = "items";
        p[1] = "0";
        p[2] = "title";
        req.addStringArray("path", p);
        bytes32 requestId = sendChainlinkRequest(req, payment);

        // Ready a contract for accepting a solution
        Hangman game = new Hangman();

        //requestId will point to the player and the game address(which is pending)
        requestIdToGame[requestId] = Game(msg.sender, game);

        emit RequestCreateGame(msg.sender, requestId);
    }

    /*
     * @notice The method called back when the chainlink oracles has a response
     * @param bytes32 the request id that was returned earlier by the chainlink request
     * @param bytes32 the data requested from the oracle
     */
    function fullfillCreateGame(bytes32 _requestId, bytes32 _data)
        public
        recordChainlinkFulfillment(_requestId)
        returns (bytes32) {

            Game storage gameInstance = requestIdToGame[_requestId];
            require(gameInstance.player != 0, "Id does not exist");

            gameInstance.game.setSolution(bytes32ToBytes(_data), _data.length);

            // game is now ready to play, update the owner of the game
            gameInstance.game.transferOwnership(gameInstance.player);

            emit FulfillCreateGame(gameInstance.player, _requestId);
    }

    /*
     * @notice A helper method that convertes bytes32 to bytes
     * @param bytes32 the data that we want to convert into bytes
     * @return bytes the data that was input that is no longer bytes32
     */
    function bytes32ToBytes(bytes32 data) private pure returns (bytes) {
        uint i = 0;
        while (i < 32 && uint(data[i]) != 0) {
            ++i;
        }
        bytes memory result = new bytes(i);
        i = 0;
        while (i < 32 && data[i] != 0) {
            result[i] = data[i];
            ++i;
        }
        return result;
    }

    /*
     * @notice Withdraws link from the contact address back to the owner of the contract
     * @dev only owner can call this method
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    /*
     * @notice Sets the url to a new url to grab words from another source
     * @dev only owner can call this method
    */
    function setUrl(string _url) public onlyOwner {
        url = _url;
    }

    /*
     * @notice cancels the sent request
     * @dev only owner can call this method
     * @param bytes32 the request id to cancel
     * @param uint256 The amount of LINK sent for the request
     * @param bytes4 The callback function specified for the request
     * @param uint256 The time of the expiration for the request
     *
     */
    function cancelRequest(bytes32 _requestId, uint256 _payment, bytes4 _callbackFunctionId, uint256 _expiration) public onlyOwner {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }
}
