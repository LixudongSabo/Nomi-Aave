// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ExampleBank is Ownable {
    address private accountOwner;

    constructor(address initialOwner) Ownable(initialOwner) {
        accountOwner = initialOwner;
    }

    function getOwner() external view returns (address owner) {
        return accountOwner;
    }

    function deposit() external payable onlyOwner {}

    function withdraw(uint256 amount) external onlyOwner {
        require(
            address(this).balance >= amount,
            "Insufficient balance in the contract"
        );

        payable(accountOwner).transfer(amount);
    }
}
