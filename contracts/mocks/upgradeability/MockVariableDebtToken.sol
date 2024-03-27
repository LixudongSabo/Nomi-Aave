// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.24;

import {VariableDebtToken} from '../../nomi_protocol/tokenization/VariableDebtToken.sol';

contract MockVariableDebtToken is VariableDebtToken {
  function getRevision() internal pure override returns (uint256) {
    return 0x2;
  }
}
