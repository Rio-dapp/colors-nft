// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RoksToken is ERC20, Ownable {
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

    constructor() ERC20("ROKS token", "ROKS") {
        RequestMessage = "token";
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
