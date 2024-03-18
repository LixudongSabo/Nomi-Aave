export type eNetwork = eEthereumNetwork | ePolygonNetwork;

export enum eEthereumNetwork {
    main = 'main',
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
  [eEthereumNetwork.main]: T;
  [eEthereumNetwork.hardhat]: T;
  [eEthereumNetwork.tenderly]: T;
  [eEthereumNetwork.goerli]: T;
}

export interface iPolygonParamsPerNetwork<T> {
  [ePolygonNetwork.matic]: T;
  [ePolygonNetwork.blueberry]: T;
}