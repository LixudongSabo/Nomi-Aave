import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import { usingTenderly } from '../../helpers/tenderly-utils';

task('nomi:polygon', 'Deploy development enviroment')
    .addFlag('verify', 'Verify contracts at Etherscan')
    .addFlag('skipRegistry', 'Skip addresses provider registration at Addresses Provider Registry')
    .setAction(async ({ verify, skipRegistry }, DRE) => {
        const POOL_NAME = ConfigNames.Matic;

        await DRE.run('set-DRE');

        // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
        if (verify) {
            checkVerification();
        }

        console.log('Migration started\n');

        console.log('0. Deploy address provider registry');
        await DRE.run('issuance:deploy-address-provider-registry', { pool: POOL_NAME });

        console.log('1. Deploy address provider');
        await DRE.run('issuance:deploy-address-provider', { pool: POOL_NAME, skipRegistry });

        console.log('2. Deploy lending pool');
        await DRE.run('issuance:deploy-lending-pool', { pool: POOL_NAME });

        console.log('3. Deploy oracles');
        await DRE.run('issuance:deploy-oracles', { pool: POOL_NAME });

        console.log('4. Deploy Data Provider');
        await DRE.run('issuance:data-provider', { pool: POOL_NAME });

        console.log('5. Deploy WETH Gateway');
        await DRE.run('issuance:deploy-weth-gateway', { pool: POOL_NAME });

        console.log('6. Initialize lending pool');
        await DRE.run('issuance:initialize-lending-pool', { pool: POOL_NAME });

        if (verify) {
            printContracts();
            console.log('7. Veryfing contracts');
            await DRE.run('secure:contract:nomi', { all: true, pool: POOL_NAME });

            console.log('8. Veryfing aTokens and debtTokens');
            await DRE.run('secure:tokens', { pool: POOL_NAME });
        }

        if (usingTenderly()) {
            const postDeployHead = DRE.tenderlyNetwork.getHead();
            const postDeployFork = DRE.tenderlyNetwork.getFork();
            console.log('Tenderly Info');
            console.log('- Head', postDeployHead);
            console.log('- Fork', postDeployFork);
        }
        console.log('\nFinished migrations');
        printContracts();
    });