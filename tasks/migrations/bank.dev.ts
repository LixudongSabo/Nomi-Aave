import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { printContracts } from '../../helpers/misc-utils';

task('bank:dev', 'Deploy development enviroment')
    .addFlag('verify', 'Verify contracts at Etherscan')
    .setAction(async ({ verify }, localDRE) => {

        await localDRE.run('set-DRE');

        // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
        if (verify) {
            checkVerification();
        }

        console.log('Migration started\n');

        console.log('0. Deploy example bank');
        await localDRE.run('dev:deploy-example-bank', {});

        console.log('\nFinished migration');
        printContracts();
    });