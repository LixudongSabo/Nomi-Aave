import { getEthersSigners } from './contracts-helpers';
import {
   ExampleBank__factory,
   LendingPoolAddressesProviderRegistry__factory,
   LendingPoolAddressesProvider__factory
} from '../types'
import { DRE, getDb, notFalsyOrZeroAddress } from './misc-utils';
import { eContractidExample, eContractidNomi, tEthereumAddress, } from './types';


export const getFirstSigner = async () => (await getEthersSigners())[0];

export const getFirstSignerAddress = async () => {
   const signer = await getFirstSigner();
   const signerAddress = await (await signer).getAddress();
   return signerAddress;
};

export const getExampleBank = async (address?: tEthereumAddress) => {
   return await ExampleBank__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidExample.ExampleBank}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );
};

export const getLendingPoolAddressesProviderRegistry = async (address?: tEthereumAddress) =>
   await LendingPoolAddressesProviderRegistry__factory.connect(
      notFalsyOrZeroAddress(address)
         ? address
         : (
            await getDb()
               .get(`${eContractidNomi.LendingPoolAddressesProviderRegistry}.${DRE.network.name}`)
               .value()
         ).address,
      await getFirstSigner()
   );

export const getLendingPoolAddressesProvider = async (address?: tEthereumAddress) => {
   return await LendingPoolAddressesProvider__factory.connect(
      address ||
      (
         await getDb()
            .get(`${eContractidNomi.LendingPoolAddressesProvider}.${DRE.network.name}`)
            .value()
      ).address,
      await getFirstSigner()
   );
};