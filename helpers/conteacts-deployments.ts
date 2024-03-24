import { eContractidExample, eContractidNomi } from './types'
import { ExampleBank__factory, LendingPoolAddressesProviderRegistry__factory } from '../types'
import {
    withSaveAndVerify,
} from './conteacts-helpers';
import { getFirstSigner, getFirstSignerAddress } from './contracts-getters';

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