import { task } from 'hardhat/config';
import {
    deployExampleBank
} from '../../helpers/contracts-deployments';

task('dev:deploy-example-bank', 'Deploy example bank')
    .addFlag('verify', 'Verify contracts at Etherscan')
    .setAction(async ({ verify }, localDRE) => {
        await localDRE.run('set-DRE');

        const addressesProvider = await deployExampleBank();

    });