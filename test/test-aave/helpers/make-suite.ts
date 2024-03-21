import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DRE } from '../../../helpers/misc-utils';
import { ExampleBank } from '../../../types';
import { Signer } from 'ethers';
import { eEthereumNetwork, eNetwork, tEthereumAddress } from '../../../helpers/types';

export interface SignerWithAddress {
    signer: Signer;
    address: tEthereumAddress;
  }
export interface TestEnv {
    bank : ExampleBank;
}

const testEnv: TestEnv = {
   bank : {} as ExampleBank
} as TestEnv;


export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
    describe(name, () => {
        before(async () => {
            console.log("Welcome")
        });
        tests(testEnv);
        after(async () => {
            console.log("Bye")
        });
    });
}