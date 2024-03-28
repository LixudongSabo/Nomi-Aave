import path from 'path';
import fs from 'fs';
import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import {
  eEthereumNetwork,
  ePolygonNetwork,
} from './helpers/types';
import {
  getCommonNetworkConfig,
  getHardhatNetworkConfig
} from './helper-hardhat-cnfig';
import * as tdly from "@tenderly/hardhat-tenderly";
import { builtinApiKey, builtinChains } from './helpers/chain-config';
tdly.setup();

require('dotenv').config();

// Custom Tasks Config
const SKIP_LOAD = process.env.SKIP_LOAD === 'true';

// Prevent to load scripts before compilation and typechain
if (!SKIP_LOAD) {
  ['misc', 'migrations', 'dev', 'issuance', 'secure', 'deployments'].forEach(
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
    privateVerification: true // if true, contracts will be verified privately, if false, contracts will be verified publicly
  },

  etherscan: {
    apiKey: {
      ...builtinApiKey
    },
    customChains: [
      ...builtinChains
    ]
  },

  gasReporter: {
    currency: process.env.CONVERT || '',
    coinmarketcap: process.env.CMC_PRO_API_KEY || '',
    enabled: true
  },

  networks: {
    mainnet: getCommonNetworkConfig(eEthereumNetwork.mainnet, 1),
    tenderly: getCommonNetworkConfig(eEthereumNetwork.tenderly, 3030),
    goerli: getCommonNetworkConfig(eEthereumNetwork.goerli, 5),
    hardhat: getHardhatNetworkConfig(eEthereumNetwork.hardhat, 3030),
    polygon: getCommonNetworkConfig(ePolygonNetwork.polygon, 137),
    polygonZkEVMTestnet: getCommonNetworkConfig(ePolygonNetwork.polygonZkEVMTestnet, 1442),
  }
};

export default config;
