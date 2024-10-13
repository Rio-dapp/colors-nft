// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RoksToken is ERC20, Ownable {
    event StateChanged(string stateData);

    constructor() ERC20("ROKS token", "ROKS") {
        _mint(_msgSender(), 1000000000);

        emit StateChanged("Deployed");
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
