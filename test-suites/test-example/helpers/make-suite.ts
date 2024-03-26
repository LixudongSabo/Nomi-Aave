import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DRE } from '../../../helpers/misc-utils';
import { ExampleBank } from '../../../types';
import { Signer } from 'ethers';
import { eEthereumNetwork, eNetwork, tEthereumAddress } from '../../../helpers/types';
import { getEthersSigners } from '../../../helpers/contracts-helpers';
import {
    getExampleBank
  } from '../../../helpers/contracts-getters';

export interface SignerWithAddress {
    signer: Signer;
    address: tEthereumAddress;
}

export interface TestEnv {
    bank: ExampleBank;
    deployer: SignerWithAddress;
    users: SignerWithAddress[];
}

const testEnv: TestEnv = {
    bank: {} as ExampleBank,
    deployer: {} as SignerWithAddress,
    users: [] as SignerWithAddress[],
} as TestEnv;

export async function initializeMakeSuite() {
    const [_deployer, ...restSigners] = await getEthersSigners();
    const deployer: SignerWithAddress = {
        address: await _deployer.getAddress(),
        signer: _deployer,
      };
    
      for (const signer of restSigners) {
        testEnv.users.push({
          signer,
          address: await signer.getAddress(),
        });
      }

        testEnv.deployer = deployer;

        testEnv.bank = await getExampleBank();
}

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