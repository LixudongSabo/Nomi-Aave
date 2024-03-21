import rawBRE from 'hardhat';
import {
    insertContractAddressInDb,
    getEthersSigners,
    registerContractInJsonDb,
    getEthersSignersAddresses,
} from '../../helpers/conteacts-helpers';
import { Signer } from 'ethers';
import {
    deployEtherBankFactory
  } from '../../helpers/conteacts-deployments';

const buildTestEnv = async (deployer: Signer, secondaryWallet: Signer) => {
    console.time('setup');
    const pantherAdmin = await deployer.getAddress();
    
    const addressesProvider = await deployEtherBankFactory();

    console.timeEnd('setup');
}

before(async () => {
    console.log('\n***************');
    console.log('Setup and snapshot started');
    console.log('***************\n');

    await rawBRE.run('set-DRE')
    const [deployer, secondaryWallet] = await getEthersSigners();

    const FORK = process.env.FORK;

    if (FORK) {
        await rawBRE.run('aave:mainnet', { skipRegistry: true });
    } else {
        console.log('-> Deploying test environment...');
        await buildTestEnv(deployer, secondaryWallet);
    }

    console.log('\n***************');
    console.log('Setup and snapshot finished');
    console.log('***************\n');
});