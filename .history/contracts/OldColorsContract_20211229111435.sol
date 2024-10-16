// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract OldColorsContract is ERC721Enumerable, Ownable {
    //Set of States
    enum StateType {
        Request,
        Respond
    }

    //List of properties
    StateType public State;
    address public Requestor;
    address public Responder;

    string public RequestMessage;
    string public ResponseMessage;

    event StateChanged(string stateData);

    constructor() ERC721("The Colors (thecolors.art)", "COLORS") {
        RequestMessage = "Colors";
        State = StateType.Request;

        emit StateChanged("Request");
    }

    // constructor function

    // call this function to send a request
    function SendRequest(string memory requestMessage) public {
        Requestor = msg.sender;

        RequestMessage = requestMessage;
        State = StateType.Request;
    }

    // call this function to send a response
    function SendResponse(string memory responseMessage) public {
        Responder = msg.sender;

        // call ContractUpdated() to record this action
        ResponseMessage = responseMessage;
        State = StateType.Respond;

        emit StateChanged("Response");
    }
}
