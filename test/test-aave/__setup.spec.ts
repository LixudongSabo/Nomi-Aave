import rawBRE from 'hardhat';
import {
    insertContractAddressInDb,
    getEthersSigners,
    registerContractInJsonDb,
    getEthersSignersAddresses,
} from '../../helpers/conteacts-helpers';
import { Signer } from 'ethers';
import {
    deployExampleBank
} from '../../helpers/conteacts-deployments';
import { initializeMakeSuite } from './helpers/make-suite';

const buildTestEnv = async (deployer: Signer, secondaryWallet: Signer) => {
    console.time('setup');
    const pantherAdmin = await deployer.getAddress();

    const addressesProvider = await deployExampleBank();

    console.timeEnd('setup');
}

before(async () => {
    console.log('\n***************');
    console.log('Setup and snapshot started');
    console.log('***************\n');

    await rawBRE.run('set-DRE')
    const [deployer, secondaryWallet] = await getEthersSigners();

    const FORK = process.env.FORK;
    const IS_FLAG = process.env.IS_FLAG || "";
    if (FORK) {
        if(IS_FLAG && IS_FLAG === "dev"){
            await rawBRE.run('bank:dev');
        }
    } else {
        console.log('-> Deploying test environment...');
        await buildTestEnv(deployer, secondaryWallet);
    }

    await initializeMakeSuite();
    console.log('\n***************');
    console.log('Setup and snapshot finished');
    console.log('***************\n');
});