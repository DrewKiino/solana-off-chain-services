import {Strategy, TokenInfo, TokenListContainer, TokenListProvider} from '@solana/spl-token-registry';

const tokenListProvider = new TokenListProvider()
let tokenInfoByAddress: Record<string, TokenInfo> | undefined = undefined

export async function getTokenInfo(
  tokenAddress: string
) {
  /// Resolve the Token List if applicable
  if (!tokenInfoByAddress) {
    tokenInfoByAddress = {}
    const tokenList = await tokenListProvider.resolve(Strategy.CDN)
    const tokenInfos = tokenList.filterByChainId(101).getList()
    for (const tokenInfo of tokenInfos) {
      tokenInfoByAddress[tokenInfo.address] = tokenInfo
    }
  }
  return tokenInfoByAddress[tokenAddress]
}