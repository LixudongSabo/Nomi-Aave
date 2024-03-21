import { Contract, Signer, utils, ethers, BigNumberish } from 'ethers';
import { getDb, DRE, waitForTx, notFalsyOrZeroAddress } from './misc-utils';
import { getDefenderRelaySigner, usingDefender } from './defender-utils';
import {
    tEthereumAddress,
    eContractid,
    eEthereumNetwork,
    iParamsPerNetwork,
    ePolygonNetwork,
    eNetwork,
    iEthereumParamsPerNetwork,
    iPolygonParamsPerNetwork,
} from './types';
import { usingTenderly, verifyAtTenderly } from './tenderly-utils';
import { verifyEtherscanContract } from './etherscan-verification';


export const getEthersSigners = async (): Promise<Signer[]> => {
    const ethersSigners = await Promise.all(await DRE.ethers.getSigners());

    if (usingDefender()) {
        const [, ...users] = ethersSigners;
        return [await getDefenderRelaySigner(), ...users];
    }
    return ethersSigners;
};

export const insertContractAddressInDb = async (id: eContractid, address: tEthereumAddress) =>
    await getDb()
        .set(`${id}.${DRE.network.name}`, {
            address,
        })
        .write();

export const registerContractInJsonDb = async (contractId: string, contractInstance: Contract) => {
    const currentNetwork = DRE.network.name;
    const FORK = process.env.FORK;
    if (FORK || (currentNetwork !== 'hardhat' && !currentNetwork.includes('coverage'))) {
        console.log(`*** ${contractId} ***\n`);
        console.log(`Network: ${currentNetwork}`);
        console.log(`tx: ${contractInstance.deployTransaction.hash}`);
        console.log(`contract address: ${contractInstance.address}`);
        console.log(`deployer address: ${contractInstance.deployTransaction.from}`);
        console.log(`gas price: ${contractInstance.deployTransaction.gasPrice}`);
        console.log(`gas used: ${contractInstance.deployTransaction.gasLimit}`);
        console.log(`\n******`);
        console.log();
    }

    await getDb()
        .set(`${contractId}.${currentNetwork}`, {
            address: contractInstance.address,
            deployer: contractInstance.deployTransaction.from,
        })
        .write();
};

export const getEthersSignersAddresses = async (): Promise<tEthereumAddress[]> =>
  await Promise.all((await getEthersSigners()).map((signer) => signer.getAddress()));

export const getCurrentBlock = async () => {
  return DRE.ethers.provider.getBlockNumber();
};

export const verifyContract = async (
    id: string,
    instance: Contract,
    args: (string | string[])[]
  ) => {
    if (usingTenderly()) {
      await verifyAtTenderly(id, instance);
    }
    await verifyEtherscanContract(instance.address, args);
    return instance;
  };

  
export const withSaveAndVerify = async <ContractType extends Contract>(
    instance: ContractType,
    id: string,
    args: (string | string[])[],
    verify?: boolean
  ): Promise<ContractType> => {
    await waitForTx(instance.deployTransaction);
    await registerContractInJsonDb(id, instance);
    if (verify) {
      await verifyContract(id, instance, args);
    }
    return instance;
  };
  