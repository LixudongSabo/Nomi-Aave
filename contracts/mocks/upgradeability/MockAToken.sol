// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.24;

import {AToken} from '../../nomi_protocol/tokenization/AToken.sol';
import {ILendingPool} from '../../nomi_protocol/interfaces/ILendingPool.sol';
import {IAaveIncentivesController} from '../../nomi_protocol/interfaces/IAaveIncentivesController.sol';

contract MockAToken is AToken {
  function getRevision() internal pure override returns (uint256) {
    return 0x2;
  }
}
