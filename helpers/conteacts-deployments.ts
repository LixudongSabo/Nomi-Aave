import { eContractid } from './types'
import { ExampleBank__factory } from '../types'
import {
    withSaveAndVerify,
} from './conteacts-helpers';
import { getFirstSigner, getFirstSignerAddress } from './contracts-getters';

export const deployExampleBank = async (verify?: boolean) =>
    withSaveAndVerify(
        await new ExampleBank__factory(await getFirstSigner()).deploy(getFirstSignerAddress()),
        eContractid.ExampleBank,
        [],
        verify
    );