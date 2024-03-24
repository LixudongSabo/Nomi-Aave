// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ILendingPoolAddressesProviderRegistry} from "../../interfaces/ILendingPoolAddressesProviderRegistry.sol";
import {Errors} from "../libraries/helpers/Errors.sol";

/**
 * @title  LendingPoolAddressesProviderRegistry contract
 * @dev 
 * - Main registry of LendingPoolAddressesProvider of multiple Nomi protocol's markets
 * - Used for indexing purposes of Nomi protocol's markets
 * - The id assigned to a LendingPoolAddressesProvider refers to the market it is connected with,
 *   for example with `0` for the unregister market,`1` for the Nomi mainnet market and `2` for the next created 
 * @author Carter
 **/
contract LendingPoolAddressesProviderRegistry is
    Ownable,
    ILendingPoolAddressesProviderRegistry
{
    mapping(address => uint256) private _addressesProviders;
    address[] private _addressesProvidersList;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerAddressesProvider(
        address provider,
        uint256 id
    ) external override onlyOwner {
        require(id != 0, Errors.LPAPR_INVALID_ADDRESSES_PROVIDER_ID);

        _addressesProviders[provider] = id;
        _addToAddressesProvidersList(provider);
        emit AddressesProviderRegistered(provider);
    }

    function unregisterAddressesProvider(address provider) external override {
        require(
            _addressesProviders[provider] > 0,
            Errors.LPAPR_PROVIDER_NOT_REGISTERED
        );

        _addressesProviders[provider] = 0;
        emit AddressesProviderUnregistered(provider);
    }

    function getAddressesProvidersList()
        external
        view
        override
        returns (address[] memory)
    {
        address[] memory addressesProvidersList = _addressesProvidersList;

        uint256 maxLength = addressesProvidersList.length;

        address[] memory activeProviders = new address[](maxLength);

        for (uint256 i = 0; i < maxLength; i++) {
            if (_addressesProviders[addressesProvidersList[i]] > 0) {
                activeProviders[i] = addressesProvidersList[i];
            }
        }

        return activeProviders;
    }

    function getAddressesProviderIdByAddress(
        address addressesProvider
    ) external view override returns (uint256) {
        return _addressesProviders[addressesProvider];
    }

    function _addToAddressesProvidersList(address provider) internal {
        uint256 providersCount = _addressesProvidersList.length;

        for (uint256 i = 0; i < providersCount; i++) {
            if (_addressesProvidersList[i] == provider) {
                return;
            }
        }

        _addressesProvidersList.push(provider);
    }
}
