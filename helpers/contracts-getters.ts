import { getEthersSigners } from './conteacts-helpers';

export const getFirstSigner = async () => (await getEthersSigners())[0];

export const getFirstSignerAddress = async () => {
   const signerAddress =  await getEthersSigners()[0].getAddress;
   return signerAddress;
};
