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
import "@tenderly/hardhat-tenderly";
import { builtinApiKey, builtinChains } from './helpers/chain-config';

require('dotenv').config();

// Custom Tasks Config
const SKIP_LOAD = process.env.SKIP_LOAD === 'true';

const FORK = process.env.FORK || '';

// Prevent to load scripts before compilation and typechain
if (!SKIP_LOAD) {
  ['misc', 'migrations', 'dev', 'issuance', 'secure'].forEach(
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
    forkNetwork: '1', //Network id of the network we want to fork
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
    mainnet: FORK ? getHardhatNetworkConfig(eEthereumNetwork.mainnet, 1) : getCommonNetworkConfig(eEthereumNetwork.mainnet, 1),
    tenderly: FORK ? getHardhatNetworkConfig(eEthereumNetwork.tenderly, 3030) : getCommonNetworkConfig(eEthereumNetwork.tenderly, 3030),
    goerli: getCommonNetworkConfig(eEthereumNetwork.goerli, 5),
    hardhat: getHardhatNetworkConfig(eEthereumNetwork.hardhat, 31337),
    polygon: FORK ? getHardhatNetworkConfig(ePolygonNetwork.polygon, 137) : getCommonNetworkConfig(ePolygonNetwork.polygon, 137),
    polygonZkEVMTestnet: getCommonNetworkConfig(ePolygonNetwork.polygonZkEVMTestnet, 1442),
  }
};

export default config;
