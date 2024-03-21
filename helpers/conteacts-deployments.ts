import { eContractid } from './types'
import { ExampleBank__factory } from '../types'
import {
    withSaveAndVerify,
} from './conteacts-helpers';
import { getFirstSigner, getFirstSignerAddress } from './contracts-getters';

export const deployEtherBankFactory = async (verify?: boolean) =>
    withSaveAndVerify(
        await new ExampleBank__factory(await getFirstSigner()).deploy(""),
        eContractid.ExampleBank,
        [],
        verify
    );