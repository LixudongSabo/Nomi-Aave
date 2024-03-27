export type eNetwork = eEthereumNetwork | ePolygonNetwork;

export enum eEthereumNetwork {
  mainnet = 'mainnet',
  hardhat = 'hardhat',
  tenderly = 'tenderly',
  goerli = 'goerli',
}

export enum ePolygonNetwork {
  polygon = 'polygon',
  polygonZkEVMTestnet = 'polygonZkEVMTestnet',
}

export type iParamsPerNetwork<T> =
  | iEthereumParamsPerNetwork<T>
  | iPolygonParamsPerNetwork<T>;

export interface iParamsPerNetworkAll<T>
  extends iEthereumParamsPerNetwork<T>,
  iPolygonParamsPerNetwork<T> { }

export interface iEthereumParamsPerNetwork<T> {
  [eEthereumNetwork.mainnet]: T;
  [eEthereumNetwork.hardhat]: T;
  [eEthereumNetwork.tenderly]: T;
  [eEthereumNetwork.goerli]: T;
}

export interface iPolygonParamsPerNetwork<T> {
  [ePolygonNetwork.polygon]: T;
  [ePolygonNetwork.polygonZkEVMTestnet]: T;
}

export type tEthereumAddress = string;


export enum eContractidNomi {
  LendingPoolAddressesProvider = 'LendingPoolAddressesProvider',
  MintableERC20 = 'MintableERC20',
  MintableDelegationERC20 = 'MintableDelegationERC20',
  LendingPoolAddressesProviderRegistry = 'LendingPoolAddressesProviderRegistry',
  LendingPoolParametersProvider = 'LendingPoolParametersProvider',
  LendingPoolConfigurator = 'LendingPoolConfigurator',
  ValidationLogic = 'ValidationLogic',
  ReserveLogic = 'ReserveLogic',
  GenericLogic = 'GenericLogic',
  LendingPool = 'LendingPool',
  PriceOracle = 'PriceOracle',
  Proxy = 'Proxy',
  MockAggregator = 'MockAggregator',
  LendingRateOracle = 'LendingRateOracle',
  AaveOracle = 'AaveOracle',
  DefaultReserveInterestRateStrategy = 'DefaultReserveInterestRateStrategy',
  LendingPoolCollateralManager = 'LendingPoolCollateralManager',
  InitializableAdminUpgradeabilityProxy = 'InitializableAdminUpgradeabilityProxy',
  MockFlashLoanReceiver = 'MockFlashLoanReceiver',
  WalletBalanceProvider = 'WalletBalanceProvider',
  AToken = 'AToken',
  MockAToken = 'MockAToken',
  DelegationAwareAToken = 'DelegationAwareAToken',
  MockStableDebtToken = 'MockStableDebtToken',
  MockVariableDebtToken = 'MockVariableDebtToken',
  AaveProtocolDataProvider = 'AaveProtocolDataProvider',
  IERC20Detailed = 'IERC20Detailed',
  StableDebtToken = 'StableDebtToken',
  VariableDebtToken = 'VariableDebtToken',
  FeeProvider = 'FeeProvider',
  TokenDistributor = 'TokenDistributor',
  StableAndVariableTokensHelper = 'StableAndVariableTokensHelper',
  ATokensAndRatesHelper = 'ATokensAndRatesHelper',
  UiPoolDataProvider = 'UiPoolDataProvider',
  UiPoolDataProviderV2 = 'UiPoolDataProviderV2',
  UiPoolDataProviderV2V3 = 'UiPoolDataProviderV2V3',
  WETHGateway = 'WETHGateway',
  WETH = 'WETH',
  WETHMocked = 'WETHMocked',
  SelfdestructTransferMock = 'SelfdestructTransferMock',
  LendingPoolImpl = 'LendingPoolImpl',
  LendingPoolConfiguratorImpl = 'LendingPoolConfiguratorImpl',
  LendingPoolCollateralManagerImpl = 'LendingPoolCollateralManagerImpl',
  MockUniswapV2Router02 = 'MockUniswapV2Router02',
  UniswapLiquiditySwapAdapter = 'UniswapLiquiditySwapAdapter',
  UniswapRepayAdapter = 'UniswapRepayAdapter',
  FlashLiquidationAdapter = 'FlashLiquidationAdapter',
  MockParaSwapAugustus = 'MockParaSwapAugustus',
  MockParaSwapAugustusRegistry = 'MockParaSwapAugustusRegistry',
  ParaSwapLiquiditySwapAdapter = 'ParaSwapLiquiditySwapAdapter',
  UiIncentiveDataProviderV2V3 = 'UiIncentiveDataProviderV2V3',
  UiIncentiveDataProviderV2 = 'UiIncentiveDataProviderV2',
}

export enum eContractidExample {
  ExampleMathLibrary = 'ExampleMathLibrary',
  ExampleBank = 'ExampleBank',
}

export type eContractid = eContractidNomi | eContractidExample;

export interface IProtocolGlobalConfig {
  TokenDistributorPercentageBase: string;
  MockUsdPriceInWei: string;
  UsdAddress: tEthereumAddress;
  NilAddress: tEthereumAddress;
  OneAddress: tEthereumAddress;
  AaveReferral: string;
}

export interface IMarketRates {
  borrowRate: string;
}


export interface ITokenAddress {
  [token: string]: tEthereumAddress;
}

export interface SymbolMap<T> {
  [symbol: string]: T;
}

export interface IBaseConfiguration {
  MarketId: string;
  ATokenNamePrefix: string;
  StableDebtTokenNamePrefix: string;
  VariableDebtTokenNamePrefix: string;
  SymbolPrefix: string;
  ProviderId: number;
  ProtocolGlobalParams: IProtocolGlobalConfig;
  ProviderRegistry: iParamsPerNetwork<tEthereumAddress | undefined>;
  ProviderRegistryOwner: iParamsPerNetwork<tEthereumAddress | undefined>;
  LendingPoolCollateralManager: iParamsPerNetwork<tEthereumAddress>;
  LendingPoolConfigurator: iParamsPerNetwork<tEthereumAddress>;
  LendingPool: iParamsPerNetwork<tEthereumAddress>;
  LendingRateOracleRatesCommon: iMultiPoolsAssets<IMarketRates>;
  LendingRateOracle: iParamsPerNetwork<tEthereumAddress>;
  TokenDistributor: iParamsPerNetwork<tEthereumAddress>;
  AaveOracle: iParamsPerNetwork<tEthereumAddress>;
  FallbackOracle: iParamsPerNetwork<tEthereumAddress>;
  ChainlinkAggregator: iParamsPerNetwork<ITokenAddress>;
  PoolAdmin: iParamsPerNetwork<tEthereumAddress | undefined>;
  PoolAdminIndex: number;
  EmergencyAdmin: iParamsPerNetwork<tEthereumAddress | undefined>;
  EmergencyAdminIndex: number;
  ATokenDomainSeparator: iParamsPerNetwork<string>;
  WETH: iParamsPerNetwork<tEthereumAddress>;
  WrappedNativeToken: iParamsPerNetwork<tEthereumAddress>;
  WethGateway: iParamsPerNetwork<tEthereumAddress>;
  ReserveFactorTreasuryAddress: iParamsPerNetwork<tEthereumAddress>;
  IncentivesController: iParamsPerNetwork<tEthereumAddress>;
  StableDebtTokenImplementation?: iParamsPerNetwork<tEthereumAddress>;
  VariableDebtTokenImplementation?: iParamsPerNetwork<tEthereumAddress>;
  ReserveAssets: iParamsPerNetwork<SymbolMap<tEthereumAddress>>;
  OracleQuoteCurrency: string;
  OracleQuoteUnit: string;
}

export interface iAssetBase<T> {
  WETH: T;
  DAI: T;
  TUSD: T;
  USDC: T;
  USDT: T;
  SUSD: T;
  AAVE: T;
  BAT: T;
  MKR: T;
  LINK: T;
  KNC: T;
  WBTC: T;
  MANA: T;
  ZRX: T;
  SNX: T;
  BUSD: T;
  YFI: T;
  UNI: T;
  USD: T;
  REN: T;
  ENJ: T;
  UniDAIWETH: T;
  UniWBTCWETH: T;
  UniAAVEWETH: T;
  UniBATWETH: T;
  UniDAIUSDC: T;
  UniCRVWETH: T;
  UniLINKWETH: T;
  UniMKRWETH: T;
  UniRENWETH: T;
  UniSNXWETH: T;
  UniUNIWETH: T;
  UniUSDCWETH: T;
  UniWBTCUSDC: T;
  UniYFIWETH: T;
  BptWBTCWETH: T;
  BptBALWETH: T;
  WMATIC: T;
  STAKE: T;
  xSUSHI: T;
  WAVAX: T;
}

export type iAavePoolAssets<T> = Pick<
  iAssetsWithoutUSD<T>,
  | 'DAI'
  | 'TUSD'
  | 'USDC'
  | 'USDT'
  | 'SUSD'
  | 'AAVE'
  | 'BAT'
  | 'MKR'
  | 'LINK'
  | 'KNC'
  | 'WBTC'
  | 'MANA'
  | 'ZRX'
  | 'SNX'
  | 'BUSD'
  | 'WETH'
  | 'YFI'
  | 'UNI'
  | 'REN'
  | 'ENJ'
  | 'xSUSHI'
>;

export type iMaticPoolAssets<T> = Pick<
  iAssetsWithoutUSD<T>,
  'DAI' | 'USDC' | 'USDT' | 'WBTC' | 'WETH' | 'WMATIC' | 'AAVE'
>;

export type iAssetsWithoutUSD<T> = Omit<iAssetBase<T>, 'USD'>;

export interface IReserveBorrowParams {
  // optimalUtilizationRate: string;
  // baseVariableBorrowRate: string;
  // variableRateSlope1: string;
  // variableRateSlope2: string;
  // stableRateSlope1: string;
  // stableRateSlope2: string;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  reserveDecimals: string;
}

export interface IReserveCollateralParams {
  baseLTVAsCollateral: string;
  liquidationThreshold: string;
  liquidationBonus: string;
}

export interface IInterestRateStrategyParams {
  name: string;
  optimalUtilizationRate: string;
  baseVariableBorrowRate: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  stableRateSlope1: string;
  stableRateSlope2: string;
}

export interface IReserveParams extends IReserveBorrowParams, IReserveCollateralParams {
  aTokenImpl: eContractid;
  reserveFactor: string;
  strategy: IInterestRateStrategyParams;
}

export interface iAssetCommon<T> {
  [key: string]: T;
}

export type iMultiPoolsAssets<T> = iAssetCommon<T> | iAavePoolAssets<T>;

export interface IMocksConfig {
  AllAssetsInitialPrices: { [key: string]: string };
}

export interface ICommonConfiguration extends IBaseConfiguration {
  ReservesConfig: iMultiPoolsAssets<IReserveParams>;
  Mocks: IMocksConfig;
}

export interface IAaveConfiguration extends ICommonConfiguration {
  ReservesConfig: iAavePoolAssets<IReserveParams>;
}

export interface IMaticConfiguration extends ICommonConfiguration {
  ReservesConfig: iMaticPoolAssets<IReserveParams>;
}

export type PoolConfiguration = ICommonConfiguration | IAaveConfiguration;

export enum AavePools {
  mainnet = 'mainnet',
  matic = 'matic',
}

export interface iParamsPerPool<T> {
  [AavePools.mainnet]: T;
  [AavePools.matic]: T;
}
