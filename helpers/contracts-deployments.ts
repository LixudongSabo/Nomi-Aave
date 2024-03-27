import {
    eContractidExample,
    eContractidNomi,
    IReserveParams,
    eNetwork,
    eContractid,
    tEthereumAddress
} from './types'
import {
    ExampleMathLibrary__factory,
    ExampleBank__factory,
    LendingPoolAddressesProviderRegistry__factory,
    LendingPoolAddressesProvider__factory,
    AToken__factory,
    DelegationAwareAToken__factory,
    StableDebtToken__factory,
    VariableDebtToken__factory,
    ATokensAndRatesHelper__factory,
    LendingPool__factory,
    ReserveLogic__factory,
    GenericLogic__factory,
    ValidationLogic__factory,
    LendingPoolConfigurator__factory,
    StableAndVariableTokensHelper__factory
} from '../types'
import {
    withSaveAndVerify,
    getOptionalParamAddressPerNetwork,
    insertContractAddressInDb
} from './contracts-helpers';
import { getFirstSigner, getFirstSignerAddress } from './contracts-getters';
import { ConfigNames, getReservesConfigByPool, loadPoolConfig } from './configuration';
import { DRE, notFalsyOrZeroAddress } from './misc-utils';
import { LendingPoolLibraryAddresses } from '../types/factories/nomi_protocol/lendingpool/LendingPool__factory';
import { Contract } from 'ethers';
import { ValidationLogicLibraryAddresses } from '../types/factories/nomi_protocol/libraries/logic/ValidationLogic__factory';

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

export const deployGenericATokenImpl = async (verify: boolean) =>
    withSaveAndVerify(
        await new AToken__factory(await getFirstSigner()).deploy(),
        eContractidNomi.AToken,
        [],
        verify
    );

export const deployDelegationAwareATokenImpl = async (verify: boolean) =>
    withSaveAndVerify(
        await new DelegationAwareAToken__factory(await getFirstSigner()).deploy(),
        eContractidNomi.DelegationAwareAToken,
        [],
        verify
    );


export const chooseATokenDeployment = (id: eContractid) => {
    switch (id) {
        case eContractidNomi.AToken:
            return deployGenericATokenImpl;
        case eContractidNomi.DelegationAwareAToken:
            return deployDelegationAwareATokenImpl;
        default:
            throw Error(`Missing aToken implementation deployment script for: ${id}`);
    }
};

export const deployGenericStableDebtToken = async (verify?: boolean) =>
    withSaveAndVerify(
        await new StableDebtToken__factory(await getFirstSigner()).deploy(),
        eContractidNomi.StableDebtToken,
        [],
        verify
    );

export const deployGenericVariableDebtToken = async (verify?: boolean) =>
    withSaveAndVerify(
        await new VariableDebtToken__factory(await getFirstSigner()).deploy(),
        eContractidNomi.VariableDebtToken,
        [],
        verify
    );


export const deployATokenImplementations = async (
    pool: ConfigNames,
    reservesConfig: { [key: string]: IReserveParams },
    verify = false
) => {
    const poolConfig = loadPoolConfig(pool);
    const network = <eNetwork>DRE.network.name;

    // Obtain the different AToken implementations of all reserves inside the Market config
    const aTokenImplementations = [
        ...Object.entries(reservesConfig).reduce<Set<eContractid>>((acc, [, entry]) => {
            acc.add(entry.aTokenImpl);
            return acc;
        }, new Set<eContractid>()),
    ];

    for (let x = 0; x < aTokenImplementations.length; x++) {
        const aTokenAddress = getOptionalParamAddressPerNetwork(
            poolConfig[aTokenImplementations[x].toString()],
            network
        );
        if (!notFalsyOrZeroAddress(aTokenAddress)) {
            const deployImplementationMethod = chooseATokenDeployment(aTokenImplementations[x]);
            console.log(`Deploying implementation`, aTokenImplementations[x]);
            await deployImplementationMethod(verify);
        }
    }

    // Debt tokens, for now all Market configs follows same implementations
    const genericStableDebtTokenAddress = getOptionalParamAddressPerNetwork(
        poolConfig.StableDebtTokenImplementation,
        network
    );
    const geneticVariableDebtTokenAddress = getOptionalParamAddressPerNetwork(
        poolConfig.VariableDebtTokenImplementation,
        network
    );

    if (!notFalsyOrZeroAddress(genericStableDebtTokenAddress)) {
        await deployGenericStableDebtToken(verify);
    }
    if (!notFalsyOrZeroAddress(geneticVariableDebtTokenAddress)) {
        await deployGenericVariableDebtToken(verify);
    }
};

export const deployReserveLogicLibrary = async (verify?: boolean) =>
    withSaveAndVerify(
        await new ReserveLogic__factory(await getFirstSigner()).deploy(),
        eContractidNomi.ReserveLogic,
        [],
        verify
    );

export const deployGenericLogic = async (verify?: boolean) =>
    withSaveAndVerify(
        await new GenericLogic__factory(await getFirstSigner()).deploy(),
        eContractidNomi.GenericLogic,
        [],
        verify
    );

export const deployValidationLogic = async (linkLibraryAddresses: ValidationLogicLibraryAddresses, verify?: boolean) =>
    withSaveAndVerify(
        await new ValidationLogic__factory(linkLibraryAddresses, await getFirstSigner()).deploy(),
        eContractidNomi.GenericLogic,
        [],
        verify
    );

export const deployAaveLibraries = async (
    verify?: boolean
): Promise<LendingPoolLibraryAddresses> => {
    const reserveLogic = await deployReserveLogicLibrary(verify);
    const genericLogic = await deployGenericLogic(verify);
    const libraries = { ["contracts/nomi_protocol/libraries/logic/GenericLogic.sol:GenericLogic"]: genericLogic.address, }
    const validationLogic = await deployValidationLogic(libraries, verify);

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
        ["contracts/nomi_protocol/libraries/logic/ValidationLogic.sol:ValidationLogic"]: validationLogic.address,
        ["contracts/nomi_protocol/libraries/logic/ReserveLogic.sol:ReserveLogic"]: reserveLogic.address,
    };
};

export const deployLendingPool = async (verify?: boolean) => {
    const libraries = await deployAaveLibraries(verify);
    const lendingPoolImpl = await new LendingPool__factory(libraries, await getFirstSigner()).deploy();
    await insertContractAddressInDb(eContractidNomi.LendingPoolImpl, lendingPoolImpl.address);
    return withSaveAndVerify(lendingPoolImpl, eContractidNomi.LendingPool, [], verify);
};

export const deployLendingPoolConfigurator = async (verify?: boolean) => {
    const lendingPoolConfiguratorImpl = await new LendingPoolConfigurator__factory(
        await getFirstSigner()
    ).deploy();
    await insertContractAddressInDb(
        eContractidNomi.LendingPoolConfiguratorImpl,
        lendingPoolConfiguratorImpl.address
    );
    return withSaveAndVerify(
        lendingPoolConfiguratorImpl,
        eContractidNomi.LendingPoolConfigurator,
        [],
        verify
    );
};

export const deployATokensAndRatesHelper = async (
    args: [tEthereumAddress, tEthereumAddress, tEthereumAddress],
    verify?: boolean
) =>
    withSaveAndVerify(
        await new ATokensAndRatesHelper__factory(await getFirstSigner()).deploy(getFirstSignerAddress(), ...args),
        eContractidNomi.ATokensAndRatesHelper,
        args,
        verify
    );
    
export const deployStableAndVariableTokensHelper = async (
    args: [tEthereumAddress, tEthereumAddress],
    verify?: boolean
) =>
    withSaveAndVerify(
        await new StableAndVariableTokensHelper__factory(await getFirstSigner()).deploy(getFirstSignerAddress(), ...args),
        eContractidNomi.StableAndVariableTokensHelper,
        args,
        verify
    );