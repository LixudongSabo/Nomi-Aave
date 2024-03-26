import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames, getEmergencyAdmin, loadPoolConfig } from '../../helpers/configuration';

task('nomi:hardhat', 'Deploy development enviroment')
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

        console.log('1. Deploy address provider');

        console.log('2. Deploy lending pool');

        console.log('3. Deploy oracles');

        console.log('4. Deploy Data Provider');

        console.log('5. Deploy WETH Gateway');

        console.log('6. Initialize lending pool');

        console.log('7. Deploy UI helpers');

    });