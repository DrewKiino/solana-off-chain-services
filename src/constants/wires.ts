
interface WireTokenInfo {
  address: string,
  symbol: string,
  name: string,
  decimals: number,
  logoURI: string,
  extensions: WireTokenInfoExtensions
}

interface WireTokenInfoExtensions {
  website: string | undefined,
  coingeckoId: string | undefined,
  telegram: string | undefined,
  medium: string | undefined,
  twitter: string | undefined
}



interface WireTokenSnapshot {

}
