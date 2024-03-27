// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.24;
pragma experimental ABIEncoderV2;

import {Ownable} from '../../dependencies/openzeppelin/access/Ownable.sol';
import {IERC20} from '../../dependencies/openzeppelin/interface/IERC20.sol';

contract MockParaSwapTokenTransferProxy is Ownable {
  constructor(address initialOwner) Ownable(initialOwner) {}

  function transferFrom(
    address token,
    address from,
    address to,
    uint256 amount
  ) external onlyOwner {
    IERC20(token).transferFrom(from, to, amount);
  }
}
