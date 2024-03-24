// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LendingPoolAddressesProviderRegistry contract
 * @author Carter
 **/
interface ILendingPoolAddressesProviderRegistry {
    event AddressesProviderRegistered(address indexed newAddress);
    event AddressesProviderUnregistered(address indexed newAddress);

    function registerAddressesProvider(address provider, uint256 id) external;

    function unregisterAddressesProvider(address provider) external;

    function getAddressesProvidersList()
        external
        view
        returns (address[] memory);

    function getAddressesProviderIdByAddress(
        address addressesProvider
    ) external view returns (uint256);
}
