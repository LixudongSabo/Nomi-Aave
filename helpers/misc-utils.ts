import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Wallet, ContractTransaction } from 'ethers';
import { tEthereumAddress } from './types';
import { isAddress } from 'ethers/lib/utils';
import { isZeroAddress } from 'ethereumjs-util';
import { SignerWithAddress } from '../test-suites/test-example/helpers/make-suite';
import { usingTenderly } from './tenderly-utils';

export const getDb = () => low(new FileSync('./deployed-contracts.json'));

export let DRE: HardhatRuntimeEnvironment;

export const setDRE = (_DRE: HardhatRuntimeEnvironment) => {
  DRE = _DRE;
};

export const waitForTx = async (tx: ContractTransaction) => await tx.wait(1);

export const notFalsyOrZeroAddress = (address: tEthereumAddress | null | undefined): boolean => {
  if (!address) {
    return false;
  }
  return isAddress(address) && !isZeroAddress(address);
};

export const impersonateAddress = async (address: tEthereumAddress): Promise<SignerWithAddress> => {
  if (!usingTenderly()) {
    await (DRE as HardhatRuntimeEnvironment).network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [address],
    });
  }
  const signer = await DRE.ethers.provider.getSigner(address);

  return {
    signer,
    address,
  };
};

export const impersonateAccountsHardhat = async (accounts: string[]) => {
  if (process.env.TENDERLY === 'true') {
    return;
  }
  for (const account of accounts) {
    await (DRE as HardhatRuntimeEnvironment).network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [account],
    });
  }
};

interface DbEntry {
  [network: string]: {
    deployer: string;
    address: string;
  };
}

export const printContracts = () => {
  const network = DRE.network.name;
  const db = getDb();
  console.log('Contracts deployed at', network);
  console.log('---------------------------------');

  const entries = Object.entries<DbEntry>(db.getState()).filter(([_k, value]) => !!value[network]);

  const contractsPrint = entries.map(
    ([key, value]: [string, DbEntry]) => `${key}: ${value[network].address}`
  );

  console.log('N# Contracts:', entries.length);
  console.log(contractsPrint.join('\n'), '\n');
};

export const chunk = <T>(arr: Array<T>, chunkSize: number): Array<Array<T>> => {
  return arr.reduce(
    (prevVal: any, currVal: any, currIndx: number, array: Array<T>) =>
      !(currIndx % chunkSize)
        ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)])
        : prevVal,
    []
  );
};

export const filterMapBy = (raw: { [key: string]: any }, fn: (key: string) => boolean) =>
  Object.keys(raw)
    .filter(fn)
    .reduce<{ [key: string]: any }>((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});

export const omit = <T extends object, U extends keyof T>(obj: T, keys: U[]): Omit<T, U> =>
  (Object.keys(obj) as U[]).reduce(
    (acc, curr) => (keys.includes(curr) ? acc : { ...acc, [curr]: obj[curr as keyof T] }),
    {} as Omit<T, U>
  );