import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { getWalletConnectConnector } from '@rainbow-me/rainbowkit';

// Define the HoleSky chain configuration
const holesky = {
  id: 17000,
  name: 'HoleSky',
  network: 'holesky',
  nativeCurrency: {
    name: 'HoleSky Ether',
    symbol: 'HSE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://ethereum-holesky-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HoleSky Explorer',
      url: 'https://holesky.etherscan.io',
    },
  },
};

export const config = getDefaultConfig({
  appName: 'stake-easy',
  projectId: '003cc2d44b51cb4325a4954fec3b28c6',
  chains: [
    holesky,
    mainnet,
  ],
  ssr: true,
});