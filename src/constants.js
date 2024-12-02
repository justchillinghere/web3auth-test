import { AuthAdapter } from "@web3auth/auth-adapter";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";

export const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const chainConfig = {
  chainNamespace: "eip155",
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const authAdapterEmpty = new AuthAdapter({});
const authAdapter = new AuthAdapter({
  adapterSettings: {
    uxMode: "redirect",
    loginConfig: {
      email_passwordless: {
        verifier: "custom-my-email-passwordless",
        typeOfLogin: "email_passwordless",
        clientId: WEB3AUTH_CLIENT_ID,
      },
      google: {
        verifier: "google-my-custom-test",
        typeOfLogin: "google",
        // clientId: GOOGLE_CLIENT_ID,
      },
      //   jwt: {
      //     verifier: "github-fluence-test",
      //     typeOfLogin: "jwt",
      //     clientId: WEB3AUTH_CLIENT_ID,
      //   },
    },
  },
});

export default new Web3AuthNoModal({
  clientId: WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "sapphire_devnet",
  privateKeyProvider: new EthereumPrivateKeyProvider({
    config: { chainConfig },
  }),
}).configureAdapter(authAdapterEmpty);
