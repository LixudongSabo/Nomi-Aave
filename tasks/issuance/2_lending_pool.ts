import { task } from 'hardhat/config';
import {
    loadPoolConfig,
    ConfigNames,
    getEmergencyAdmin,
} from '../../helpers/configuration';
import {
    getLendingPoolAddressesProvider,
    getLendingPool,
    getLendingPoolConfiguratorProxy,
} from '../../helpers/contracts-getters';
import { eContractid, eNetwork } from '../../helpers/types';
import { getParamPerNetwork, insertContractAddressInDb } from '../../helpers/contracts-helpers';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import {
    deployATokenImplementations,
    deployATokensAndRatesHelper,
    deployLendingPool,
    deployLendingPoolConfigurator,
    deployStableAndVariableTokensHelper,
  } from '../../helpers/contracts-deployments';
  
task('issuance:deploy-lending-pool', 'Deploy lending pool for dev enviroment')
    .addFlag('verify', 'Verify contracts at Etherscan')
    .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
    .setAction(async ({ verify, pool }, DRE) => {
        try {
            await DRE.run('set-DRE');
            const network = <eNetwork>DRE.network.name;
            const poolConfig = loadPoolConfig(pool);
            const addressesProvider = await getLendingPoolAddressesProvider();

            const { LendingPool, LendingPoolConfigurator } = poolConfig;

            // Reuse/deploy lending pool implementation
            let lendingPoolImplAddress = getParamPerNetwork(LendingPool, network);
            if (!notFalsyOrZeroAddress(lendingPoolImplAddress)) {
                console.log('\tDeploying new lending pool implementation & libraries...');
                const lendingPoolImpl = await deployLendingPool(verify);
                lendingPoolImplAddress = lendingPoolImpl.address;
                await lendingPoolImpl.initialize(addressesProvider.address);
            }
        } catch (error) {

        }

    })