import { eContractidExample, eContractidNomi } from './types'
import {
    ExampleBank__factory,
    LendingPoolAddressesProviderRegistry__factory,
    LendingPoolAddressesProvider__factory
} from '../types'
import {
    withSaveAndVerify,
} from './contracts-helpers';
import { getFirstSigner, getFirstSignerAddress } from './contracts-getters';
import { LendingPoolLibraryAddresses } from '../types/LendingPool__factory';

export const deployExampleBank = async (verify?: boolean) =>
    withSaveAndVerify(
        await new ExampleBank__factory(await getFirstSigner()).deploy(getFirstSignerAddress()),
        eContractidExample.ExampleBank,
        [],
        verify
    );

export const deployLendingPoolAddressesProviderRegistry = async (verify?: boolean) =>
    withSaveAndVerify(
        await new LendingPoolAddressesProviderRegistry__factory(await getFirstSigner()).deploy(getFirstSignerAddress()),
        eContractidNomi.LendingPoolAddressesProviderRegistry,
        [],
        verify
    );



export const deployLendingPoolAddressesProvider = async (marketId: string, verify?: boolean) =>
    withSaveAndVerify(
        await new LendingPoolAddressesProvider__factory(await getFirstSigner()).deploy(getFirstSignerAddress(), marketId),
        eContractidNomi.LendingPoolAddressesProvider,
        [marketId],
        verify
    );

export const deployAaveLibraries = async (
    verify?: boolean
): Promise<LendingPoolLibraryAddresses> => {
    const reserveLogic = await deployReserveLogicLibrary(verify);
    const genericLogic = await deployGenericLogic(reserveLogic, verify);
    const validationLogic = await deployValidationLogic(reserveLogic, genericLogic, verify);

    // Hardcoded solidity placeholders, if any library changes path this will fail.
    // The '__$PLACEHOLDER$__ can be calculated via solidity keccak, but the LendingPoolLibraryAddresses Type seems to
    // require a hardcoded string.
    //
    //  how-to:
    //  1. PLACEHOLDER = solidityKeccak256(['string'], `${libPath}:${libName}`).slice(2, 36)
    //  2. LIB_PLACEHOLDER = `__$${PLACEHOLDER}$__`
    // or grab placeholdes from LendingPoolLibraryAddresses at Typechain generation.
    //
    // libPath example: contracts/libraries/logic/GenericLogic.sol
    // libName example: GenericLogic
    return {
        ['__$de8c0cf1a7d7c36c802af9a64fb9d86036$__']: validationLogic.address,
        ['__$22cd43a9dda9ce44e9b92ba393b88fb9ac$__']: reserveLogic.address,
    };
};

export const deployLendingPool = async (verify?: boolean) => {
    const libraries = await deployAaveLibraries(verify);
    const lendingPoolImpl = await new LendingPoolFactory(libraries, await getFirstSigner()).deploy();
    await insertContractAddressInDb(eContractid.LendingPoolImpl, lendingPoolImpl.address);
    return withSaveAndVerify(lendingPoolImpl, eContractid.LendingPool, [], verify);
};