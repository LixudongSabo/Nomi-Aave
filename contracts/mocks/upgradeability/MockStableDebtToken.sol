// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.24;

import {StableDebtToken} from '../../nomi_protocol/tokenization/StableDebtToken.sol';

contract MockStableDebtToken is StableDebtToken {
  function getRevision() internal pure override returns (uint256) {
    return 0x2;
  }
}
