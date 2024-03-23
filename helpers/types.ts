export type eNetwork = eEthereumNetwork | ePolygonNetwork;

export enum eEthereumNetwork {
    mainnet = 'mainnet',
    hardhat = 'hardhat',
    tenderly = 'tenderly',
    goerli = 'goerli',
}

export enum ePolygonNetwork {
    matic = 'matic',
    blueberry = 'blueberry',
}

export type iParamsPerNetwork<T> =
  | iEthereumParamsPerNetwork<T>
  | iPolygonParamsPerNetwork<T>;

  export interface iParamsPerNetworkAll<T>
  extends iEthereumParamsPerNetwork<T>,
    iPolygonParamsPerNetwork<T>{}

export interface iEthereumParamsPerNetwork<T> {
  [eEthereumNetwork.mainnet]: T;
  [eEthereumNetwork.hardhat]: T;
  [eEthereumNetwork.tenderly]: T;
  [eEthereumNetwork.goerli]: T;
}

export interface iPolygonParamsPerNetwork<T> {
  [ePolygonNetwork.matic]: T;
  [ePolygonNetwork.blueberry]: T;
}

export type tEthereumAddress = string;


export enum eContractid {
  ExampleBank = 'ExampleBank',
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