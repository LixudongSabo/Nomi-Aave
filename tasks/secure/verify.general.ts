import { task } from 'hardhat/config';
import { eContractid, eContractidNomi, eNetwork, ICommonConfiguration } from '../../helpers/types';
import {
    loadPoolConfig,
    ConfigNames,
} from '../../helpers/configuration';
import { verifyContract, getParamPerNetwork } from '../../helpers/conteacts-helpers';
import { notFalsyOrZeroAddress } from '../../helpers/misc-utils';
import {
    getLendingPoolAddressesProviderRegistry,
    getFirstSignerAddress
} from '../../helpers/contracts-getters';

task('secure:contract:nomi', 'Verify contracts at Etherscan')
    .addFlag('all', 'Verify all contracts at Etherscan')
    .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
    .setAction(async ({ all, pool }, DRE) => {
        await DRE.run('set-DRE');
        const network = DRE.network.name as eNetwork;
        const poolConfig = loadPoolConfig(pool);
        const {
            ProviderRegistry,
        } = poolConfig as ICommonConfiguration;

        const registryAddress = getParamPerNetwork(ProviderRegistry, network);
        const addressesProviderRegistry = notFalsyOrZeroAddress(registryAddress)
            ? await getLendingPoolAddressesProviderRegistry(registryAddress)
            : await getLendingPoolAddressesProviderRegistry();

        // Address Provider Registry
        console.log('\n- Verifying address provider registry...\n');
        await verifyContract(
            eContractidNomi.LendingPoolAddressesProviderRegistry,
            addressesProviderRegistry,
            [await getFirstSignerAddress()]
        );
        console.log('Finished verifications.');
    });