import {
    AavePools,
    PoolConfiguration,
    iMultiPoolsAssets,
    IReserveParams,
    eNetwork,
    IBaseConfiguration,
    tEthereumAddress
} from './types';
import { DRE } from './misc-utils';
import { getParamPerNetwork, getEthersSignersAddresses, getParamPerPool } from './contracts-helpers';
import AaveConfig from '../markets/mainnet';
import MaticConfig from '../markets/polygon';

export enum ConfigNames {
    Mainnet = 'Mainnet',
    Matic = 'Matic'
}

export const getEmergencyAdmin = async (config: IBaseConfiguration): Promise<tEthereumAddress> => {
    const currentNetwork = process.env.FORK ? process.env.FORK : DRE.network.name;
    const targetAddress = getParamPerNetwork(config.EmergencyAdmin, <eNetwork>currentNetwork);
    if (targetAddress) {
        return targetAddress;
    }
    const addressList = await getEthersSignersAddresses();
    const addressIndex = config.EmergencyAdminIndex;
    return addressList[addressIndex];
};


export const loadPoolConfig = (configName: ConfigNames): PoolConfiguration => {
    switch (configName) {
        case ConfigNames.Mainnet:
            return AaveConfig;
        case ConfigNames.Matic:
            return MaticConfig;
        default:
            throw new Error(
                `Unsupported pool configuration: ${configName} is not one of the supported configs ${Object.values(
                    ConfigNames
                )}`
            );
    }
};

// ----------------
// PROTOCOL PARAMS PER POOL
// ----------------

export const getReservesConfigByPool = (pool: AavePools): iMultiPoolsAssets<IReserveParams> =>
    getParamPerPool<iMultiPoolsAssets<IReserveParams>>(
        {
            [AavePools.mainnet]: {
                ...AaveConfig.ReservesConfig,
            },
            [AavePools.matic]: {
                ...MaticConfig.ReservesConfig,
            }
        },
        pool
    );

export const getGenesisPoolAdmin = async (
    config: IBaseConfiguration
): Promise<tEthereumAddress> => {
    const currentNetwork = process.env.FORK ? process.env.FORK : DRE.network.name;
    const targetAddress = getParamPerNetwork(config.PoolAdmin, <eNetwork>currentNetwork);
    if (targetAddress) {
        return targetAddress;
    }
    const addressList = await getEthersSignersAddresses();
    const addressIndex = config.PoolAdminIndex;
    return addressList[addressIndex];
};