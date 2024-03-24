// @ts-ignore
import { HardhatNetworkForkingUserConfig, HardhatUserConfig } from 'hardhat/types';
import {
    eEthereumNetwork,
    ePolygonNetwork,
    iParamsPerNetwork
} from './types';

require('dotenv').config();

const INFURA_KEY = process.env.INFURA_KEY || '';
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || '';
const POLYGON_KEY = process.env.POLYGON_KEY || '';
const TENDERLY_FORK_ID = process.env.TENDERLY_FORK_ID || '';
const FORK = process.env.FORK || '';
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
    ? parseInt(process.env.FORK_BLOCK_NUMBER)
    : 0;

const GWEI = 1000 * 1000 * 1000;

export const buildForkConfig = (): HardhatNetworkForkingUserConfig | undefined => {
    let forkMode;
    if (FORK) {
        forkMode = {
            url: NETWORKS_RPC_URL[FORK],
        };
        if (FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK]) {
            forkMode.blockNumber = FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK];
        }
    }
    return forkMode;
};

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
    [eEthereumNetwork.mainnet]: ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    [eEthereumNetwork.hardhat]: 'http://localhost:8545',
    [eEthereumNetwork.tenderly]: `https://rpc.tenderly.co/fork/`,
    [eEthereumNetwork.goerli]: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    [ePolygonNetwork.polygonZkEVMTestnet]: 'https://rpc.public.zkevm-test.net',
    [ePolygonNetwork.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_KEY}`,
};

export const NETWORKS_DEFAULT_GAS: iParamsPerNetwork<number> = {
    [eEthereumNetwork.mainnet]: 65 * GWEI,
    [eEthereumNetwork.hardhat]: 65 * GWEI,
    [eEthereumNetwork.tenderly]: 1 * GWEI,
    [eEthereumNetwork.goerli]: 2 * GWEI,
    [ePolygonNetwork.polygonZkEVMTestnet]: 1 * GWEI,
    [ePolygonNetwork.polygon]: 35 * GWEI,
};

export const BLOCK_TO_FORK: iParamsPerNetwork<number | undefined> = {
    [eEthereumNetwork.mainnet]: 12406069,
    [eEthereumNetwork.hardhat]: undefined,
    [eEthereumNetwork.tenderly]: undefined,
    [eEthereumNetwork.goerli]: undefined,
    [ePolygonNetwork.polygonZkEVMTestnet]: undefined,
    [ePolygonNetwork.polygon]: undefined,
};
