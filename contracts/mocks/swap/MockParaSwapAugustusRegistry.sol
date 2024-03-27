// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.24;
pragma experimental ABIEncoderV2;

import {IParaSwapAugustusRegistry} from '../../nomi_protocol/interfaces/IParaSwapAugustusRegistry.sol';

contract MockParaSwapAugustusRegistry is IParaSwapAugustusRegistry {
  address immutable AUGUSTUS;

  constructor(address augustus) {
    AUGUSTUS = augustus;
  }

  function isValidAugustus(address augustus) external view override returns (bool) {
    return augustus == AUGUSTUS;
  }
}
