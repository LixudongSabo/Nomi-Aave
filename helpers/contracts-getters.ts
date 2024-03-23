import { getEthersSigners } from './conteacts-helpers';
import { ExampleBank__factory } from '../types'
import { DRE, getDb } from './misc-utils';
import { eContractid, tEthereumAddress, } from './types';


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
         await getDb().get(`${eContractid.ExampleBank}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );
};