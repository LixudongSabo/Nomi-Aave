import { TestEnv, makeSuite } from './helpers/make-suite';
import { utils } from 'ethers';
import { expect } from 'chai';

makeSuite('ExampleBankTest', (testEnv: TestEnv) => {

  it('Checks the bank Ownable is initialOwner', async () => {
    const { bank } = testEnv;

    const owner = await bank.getOwner();

    expect(owner).to.be.equal("0xc783df8a850f42e7F7e57013759C285caa701eB6", 'Invalid length of the addresses providers list');
  });

  it('Check Ownable account can be deposited into the bank' , async () => {
    const { bank, users } = testEnv;
    const caller = users[1];

    bank.deposit({value : utils.parseEther("0.1")});
  });
});