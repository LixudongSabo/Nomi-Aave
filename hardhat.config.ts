import path from 'path';
import fs from 'fs';
import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config();

import {
  eEthereumNetwork,
  eNetwork,
  ePolygonNetwork,
} from './helpers/types';
import {
  NETWORKS_RPC_URL,
  NETWORKS_DEFAULT_GAS,
  buildForkConfig,
} from './helper-hardhat-cnfig';
import { BUIDLEREVM_CHAINID, COVERAGE_CHAINID } from './helpers/buidler-constants';
import { accounts } from './helpers/test-wallets';

import * as tenderly from "@tenderly/hardhat-tenderly";
tenderly.setup(
  {  automaticVerifications: false,}
);

// Custom Tasks Config
const SKIP_LOAD = process.env.SKIP_LOAD === 'true';

// Network Config
const DEFAULT_BLOCK_GAS_LIMIT = 8000000;
const DEFAULT_GAS_MUL = 5;

// The major milestones
const HARDFORK = 'cancun';

// The mock of accounts || The account of deploy
const ACCOUNTS_KEY = process.env.MOCK_ACCOUNTS_KEY || '';
const MNEMONIC = process.env.MNEMONIC || '';
const MNEMONIC_PATH = "m/44'/60'/0'/0";

// The Dev‘Hardhat Config
const UNLIMITED_BYTECODE_SIZE = process.env.UNLIMITED_BYTECODE_SIZE === 'true';

// Prevent to load scripts before compilation and typechain
if (!SKIP_LOAD) {
  ['misc', 'migrations', '.dev', '.issuance', 'verifications', 'deployments', 'helpers'].forEach(
    (folder) => {
      const tasksPath = path.join(__dirname, 'tasks', folder);
      fs.readdirSync(tasksPath)
        .filter((pth) => pth.includes('.ts'))
        .forEach((task) => {
          require(`${tasksPath}/${task}`);
        });
    }
  );
}

require(`${path.join(__dirname, 'tasks/misc')}/set-bre.ts`);

const getCommonNetworkConfig = (networkName: eNetwork, networkId: number) => ({
  url: NETWORKS_RPC_URL[networkName],
  hardfork: HARDFORK,
  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  gasMultiplier: DEFAULT_GAS_MUL,
  gasPrice: NETWORKS_DEFAULT_GAS[networkName],
  chainId: networkId,
  accounts: ACCOUNTS_KEY
    ? [ACCOUNTS_KEY]
    : {
      mnemonic: MNEMONIC,
      path: MNEMONIC_PATH,
      initialIndex: 0,
      count: 20,
    },
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',
    },
  },

  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },

  tenderly: {
    username: "Carter_Panther", // tenderly username (or organization name)
    project: "aave", // project name
    privateVerification: false // if true, contracts will be verified privately, if false, contracts will be verified publicly
  },
  
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_KEY || '',
      goerli: process.env.ETHERSCAN_KEY || '',

      polygon: process.env.ETHERSCAN_POLYGON_KEY || '',
      polygonZkEVMTestnet: process.env.POLYGONSCAN_API_KEY || "",
    }
  },

  gasReporter: {
    currency: "USD",
    coinmarketcap: "16489d0b-da44-41f7-bfc4-45def8dc6ab4",
    enabled: true
  },

  networks: {
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    tenderly: getCommonNetworkConfig(eEthereumNetwork.tenderly, 3030),
    goerli: getCommonNetworkConfig(eEthereumNetwork.goerli, 5),

    matic: getCommonNetworkConfig(ePolygonNetwork.matic, 137),
    blueberry: getCommonNetworkConfig(ePolygonNetwork.blueberry, 1442),

    hardhat: {
      hardfork: 'cancun',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      allowUnlimitedContractSize: UNLIMITED_BYTECODE_SIZE,
      chainId: BUIDLEREVM_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
      forking: buildForkConfig(),
    },
  }
};

export default config;
