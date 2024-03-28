import { getEthersSigners } from './contracts-helpers';
import {
   ExampleBank__factory,
   LendingPoolAddressesProviderRegistry__factory,
   LendingPoolAddressesProvider__factory,
   LendingPool__factory,
   LendingPoolConfigurator__factory,
   StableAndVariableTokensHelper__factory,
   AaveOracle__factory,
   LendingRateOracle__factory,
   WETHGateway__factory,
   AaveProtocolDataProvider__factory,
   AToken__factory,
   DefaultReserveInterestRateStrategy__factory,
   InitializableAdminUpgradeabilityProxy__factory,
   StableDebtToken__factory,
   VariableDebtToken__factory,
   ATokensAndRatesHelper__factory
} from '../types'
import { DRE, getDb, notFalsyOrZeroAddress, omit } from './misc-utils';
import { eContractidExample, eContractidNomi, tEthereumAddress, } from './types';


export const getFirstSigner = async () => (await getEthersSigners())[0];

export const getFirstSignerAddress = async () => {
   const signer = await getFirstSigner();
   const signerAddress = await (await signer).getAddress();
   return signerAddress;
};

export const getExampleBank = async (address?: tEthereumAddress) => {
   return await ExampleBank__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidExample.ExampleBank}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );
};

export const getLendingPoolAddressesProviderRegistry = async (address?: tEthereumAddress) =>
   await LendingPoolAddressesProviderRegistry__factory.connect(
      notFalsyOrZeroAddress(address)
         ? address
         : (
            await getDb()
               .get(`${eContractidNomi.LendingPoolAddressesProviderRegistry}.${DRE.network.name}`)
               .value()
         ).address,
      await getFirstSigner()
   );

export const getLendingPoolAddressesProvider = async (address?: tEthereumAddress) => {
   return await LendingPoolAddressesProvider__factory.connect(
      address ||
      (
         await getDb()
            .get(`${eContractidNomi.LendingPoolAddressesProvider}.${DRE.network.name}`)
            .value()
      ).address,
      await getFirstSigner()
   );
};

export const getLendingPool = async (address?: tEthereumAddress) =>
   await LendingPool__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.LendingPool}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );

export const getLendingPoolConfiguratorProxy = async (address?: tEthereumAddress) => {
   return await LendingPoolConfigurator__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.LendingPoolConfigurator}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );
};

export const getStableAndVariableTokensHelper = async (address?: tEthereumAddress) =>
   await StableAndVariableTokensHelper__factory.connect(
      address ||
      (
         await getDb()
            .get(`${eContractidNomi.StableAndVariableTokensHelper}.${DRE.network.name}`)
            .value()
      ).address,
      await getFirstSigner()
   );

export const getAaveOracle = async (address?: tEthereumAddress) =>
   await AaveOracle__factory.connect(
      address || (await getDb().get(`${eContractidNomi.AaveOracle}.${DRE.network.name}`).value()).address,
      await getFirstSigner()
   );

export const getLendingRateOracle = async (address?: tEthereumAddress) =>
   await LendingRateOracle__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.LendingRateOracle}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );

export const getQuoteCurrencies = (oracleQuoteCurrency: string): string[] => {
   switch (oracleQuoteCurrency) {
      case 'USD':
         return ['USD'];
      case 'ETH':
      case 'WETH':
      default:
         return ['ETH', 'WETH'];
   }
};

export const getPairsTokenAggregator = (
   allAssetsAddresses: {
      [tokenSymbol: string]: tEthereumAddress;
   },
   aggregatorsAddresses: { [tokenSymbol: string]: tEthereumAddress },
   oracleQuoteCurrency: string
): [string[], string[]] => {
   const assetsWithoutQuoteCurrency = omit(
      allAssetsAddresses,
      getQuoteCurrencies(oracleQuoteCurrency)
   );

   const pairs = Object.entries(assetsWithoutQuoteCurrency).reduce<[string, string][]>(
      (acc, [tokenSymbol, tokenAddress]) => {
         const aggregatorAddressIndex = Object.keys(aggregatorsAddresses).findIndex(
            (value) => value === tokenSymbol
         );
         if (aggregatorAddressIndex >= 0) {
            const [, aggregatorAddress] = (
               Object.entries(aggregatorsAddresses) as [string, tEthereumAddress][]
            )[aggregatorAddressIndex];
            return [...acc, [tokenAddress, aggregatorAddress]];
         }
         return acc;
      },
      []
   );

   const mappedPairs = pairs.map(([asset]) => asset);
   const mappedAggregators = pairs.map(([, source]) => source);

   return [mappedPairs, mappedAggregators];
};

export const getWETHGateway = async (address?: tEthereumAddress) =>
   await WETHGateway__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.WETHGateway}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );

export const getAaveProtocolDataProvider = async (address?: tEthereumAddress) =>
   await AaveProtocolDataProvider__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.AaveProtocolDataProvider}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );

export const getAddressById = async (id: string): Promise<tEthereumAddress | undefined> =>
   (await getDb().get(`${id}.${DRE.network.name}`).value())?.address || undefined;


export const getAToken = async (address?: tEthereumAddress) =>
   await AToken__factory.connect(
      address || (await getDb().get(`${eContractidNomi.AToken}.${DRE.network.name}`).value()).address,
      await getFirstSigner()
   );

export const getInterestRateStrategy = async (address?: tEthereumAddress) =>
   await DefaultReserveInterestRateStrategy__factory.connect(
      address ||
      (
         await getDb()
            .get(`${eContractidNomi.DefaultReserveInterestRateStrategy}.${DRE.network.name}`)
            .value()
      ).address,
      await getFirstSigner()
   );


export const getProxy = async (address: tEthereumAddress) =>
   await InitializableAdminUpgradeabilityProxy__factory.connect(address, await getFirstSigner());

export const getStableDebtToken = async (address?: tEthereumAddress) =>
   await StableDebtToken__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.StableDebtToken}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );

export const getVariableDebtToken = async (address?: tEthereumAddress) =>
   await VariableDebtToken__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.VariableDebtToken}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );

export const getATokensAndRatesHelper = async (address?: tEthereumAddress) =>
   await ATokensAndRatesHelper__factory.connect(
      address ||
      (
         await getDb().get(`${eContractidNomi.ATokensAndRatesHelper}.${DRE.network.name}`).value()
      ).address,
      await getFirstSigner()
   );