import { eContractidExample, eContractidNomi } from './types'
import {
    ExampleMathLibrary__factory,
    ExampleBank__factory,
    LendingPoolAddressesProviderRegistry__factory,
    LendingPoolAddressesProvider__factory
} from '../types'
import {
    withSaveAndVerify,
} from './contracts-helpers';
import { getFirstSigner, getFirstSignerAddress } from './contracts-getters';

export const deployExampleBank = async (verify?: boolean) => {
    const lib = await deployExampleMathLibrary(verify)
    const libraries = {
        ["contracts/dependencies/panther/utils/ExampleMathLibrary.sol:ExampleMathLibrary"]
            : lib.address
    };
    return withSaveAndVerify(
        await new ExampleBank__factory(libraries, await getFirstSigner()).deploy(getFirstSignerAddress()),
        eContractidExample.ExampleBank,
        [],
        verify
    )
};

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

export const deployExampleMathLibrary = async (verify?: boolean) =>
    withSaveAndVerify(
        await new ExampleMathLibrary__factory(await getFirstSigner()).deploy(),
        eContractidExample.ExampleMathLibrary,
        [],
        verify
    );


