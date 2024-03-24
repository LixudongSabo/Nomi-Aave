// @ts-ignore
import { HardhatNetworkForkingUserConfig, HardhatNetworkAccountUserConfig, HardhatNetworkHDAccountsUserConfig } from 'hardhat/types';
import {
    eEthereumNetwork,
    ePolygonNetwork,
    eNetwork,
    iParamsPerNetwork
} from './helpers/types';
import { accounts } from './helpers/test-wallets';

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

// The mock of accounts || The account of deploy
const ACCOUNTS_KEY = process.env.MOCK_ACCOUNTS_KEY || '';
const MNEMONIC = process.env.MNEMONIC || '';
const MNEMONIC_PATH = "m/44'/60'/0'/0";

// Network Config
const DEFAULT_BLOCK_GAS_LIMIT = 8000000;
const DEFAULT_GAS_MUL = 5;

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
    [eEthereumNetwork.hardhat]: 8 * GWEI,
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

export const HARDFORK: iParamsPerNetwork<string | undefined> = {
    [eEthereumNetwork.mainnet]: 'cancun',
    [eEthereumNetwork.hardhat]: 'cancun',
    [eEthereumNetwork.tenderly]: undefined,
    [eEthereumNetwork.goerli]: 'cancun',
    [ePolygonNetwork.polygonZkEVMTestnet]: undefined,
    [ePolygonNetwork.polygon]: undefined,
};

export const UNLIMITED_BYTECODE_SIZE: iParamsPerNetwork<boolean> = {
    [eEthereumNetwork.mainnet]: true,
    [eEthereumNetwork.hardhat]: true,
    [eEthereumNetwork.tenderly]: true,
    [eEthereumNetwork.goerli]: true,
    [ePolygonNetwork.polygonZkEVMTestnet]: true,
    [ePolygonNetwork.polygon]: true,
};

export const ACCOUNTS: iParamsPerNetwork<HardhatNetworkAccountUserConfig[]
    | HardhatNetworkHDAccountsUserConfig> = {
    [eEthereumNetwork.mainnet]: [{ privateKey: ACCOUNTS_KEY, balance: "" }],
    [eEthereumNetwork.hardhat]: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
    })),
    [eEthereumNetwork.tenderly]: {
        mnemonic: MNEMONIC,
        path: MNEMONIC_PATH,
        initialIndex: 0,
        count: 20,
    },
    [eEthereumNetwork.goerli]: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
    })),
    [ePolygonNetwork.polygonZkEVMTestnet]: [{ privateKey: ACCOUNTS_KEY, balance: "" }],
    [ePolygonNetwork.polygon]: {
        mnemonic: MNEMONIC,
        path: MNEMONIC_PATH,
        initialIndex: 0,
        count: 20,
    },
};

export const FORKING: iParamsPerNetwork<HardhatNetworkForkingUserConfig | undefined> = {
    [eEthereumNetwork.mainnet]: undefined,
    [eEthereumNetwork.hardhat]: buildForkConfig(),
    [eEthereumNetwork.tenderly]: undefined,
    [eEthereumNetwork.goerli]: undefined,
    [ePolygonNetwork.polygonZkEVMTestnet]: undefined,
    [ePolygonNetwork.polygon]: undefined,
}

export const getCommonNetworkConfig = (networkName: eNetwork, networkId: number) => (
    {
        chainId: networkId,
        gas: DEFAULT_BLOCK_GAS_LIMIT,
        gasPrice: NETWORKS_DEFAULT_GAS[networkName],
        gasMultiplier: DEFAULT_GAS_MUL,
        url: NETWORKS_RPC_URL[networkName],
        accounts: ACCOUNTS_KEY
            ? [ACCOUNTS_KEY]
            : {
                mnemonic: MNEMONIC,
                path: MNEMONIC_PATH,
                initialIndex: 0,
                count: 20,
            },
    });

export const getHardhatNetworkConfig = (networkName: eNetwork, networkId: number) => (
    {
        chainId: networkId,
        gas: DEFAULT_BLOCK_GAS_LIMIT,
        gasPrice: NETWORKS_DEFAULT_GAS[networkName],
        gasMultiplier: DEFAULT_GAS_MUL,
        hardfork: HARDFORK[networkName],
        blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
        throwOnTransactionFailures: true,
        throwOnCallFailures: true,
        allowUnlimitedContractSize: UNLIMITED_BYTECODE_SIZE[networkName],
        accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
            privateKey: secretKey,
            balance,
        })),
        forking: buildForkConfig(),
    });