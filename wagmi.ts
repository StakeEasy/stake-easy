import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  holesky,
} from 'wagmi/chains';
import { getWalletConnectConnector } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'stake-easy',
  projectId: '003cc2d44b51cb4325a4954fec3b28c6',
  chains: [
    holesky,
    mainnet,
    // arbitrum,
    // base,
    // optimism,
    // polygon,
    // sepolia,
  ],
  ssr: true,
});