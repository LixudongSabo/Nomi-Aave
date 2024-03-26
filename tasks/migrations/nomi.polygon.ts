import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames, getEmergencyAdmin, loadPoolConfig } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';

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

        console.log('4. Deploy Data Provider');

        console.log('5. Deploy WETH Gateway');

        console.log('6. Initialize lending pool');

        console.log('7. Deploy UI helpers');

        if (verify) {
            printContracts();
            console.log('8. Veryfing contracts');
            await DRE.run('secure:contract:nomi', { all: true, pool: POOL_NAME });
          }

        printContracts();
    });