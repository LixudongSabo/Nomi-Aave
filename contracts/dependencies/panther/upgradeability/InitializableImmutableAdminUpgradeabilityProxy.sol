// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.24;

import "./BaseImmutableAdminUpgradeabilityProxy.sol";
import "../../../dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol";

/**
 * @title InitializableAdminUpgradeabilityProxy
 * @dev Extends BaseAdminUpgradeabilityProxy with an initializer function
 */
contract InitializableImmutableAdminUpgradeabilityProxy is
    BaseImmutableAdminUpgradeabilityProxy,
    InitializableUpgradeabilityProxy
{
    constructor(
        address IIAPadmin
    ) BaseImmutableAdminUpgradeabilityProxy(IIAPadmin) {}

    /**
     * @dev Only fall back when the sender is not the admin.
     */
    function _willFallback()
        internal
        override(BaseImmutableAdminUpgradeabilityProxy, Proxy)
    {
        BaseImmutableAdminUpgradeabilityProxy._willFallback();
    }
}
