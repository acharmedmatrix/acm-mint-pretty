import './App.css';
import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';
import Home from './Home';
import card from './images/Scratch_Card_Animate_1.gif';

import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from '@solana/wallet-adapter-wallets';

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';

import { ThemeProvider, createTheme } from '@material-ui/core';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID!,
    );

    return candyMachineId;
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(
  rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'),
);

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
const txTimeoutInMilliseconds = 30000;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [],
  );

  return (
    <div>
      <div className="description">
        <img src={card} alt="sample card"></img>
        <p className="myTitle">
          Welcome to Solana Scratch Off!
        </p>
        <p>
          Welcome to The Solana Lotter Scratch Offs!
          <br></br>Inspired by everyone's favorite degen game. Our scratch offs are a high supply, low cost chance to 10x, 20x, even 100x your bag!
          <br></br>Solana Lotto Scratch Offs are INSTANT WIN meaning your NFTs metadata will tell you right away if you're a winner or not! Winning tickets can be sent to thesolanalottery.sol (BV3jnsxKk9PZSeWHSWb5gD2Y1w6QnR7xuUWKih8RhjZ7) to claim your prize!
        </p>
      </div>

      <ThemeProvider theme={theme}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletDialogProvider>
              <Home
                candyMachineId={candyMachineId}
                connection={connection}
                startDate={startDateSeed}
                txTimeout={txTimeoutInMilliseconds}
                rpcHost={rpcHost}
              />
            </WalletDialogProvider>
          </WalletProvider>
        </ConnectionProvider>

        <div className="payouts">
          <br></br>
          <b>Payouts <a href="https://explorer.solana.com/address/BV3jnsxKk9PZSeWHSWb5gD2Y1w6QnR7xuUWKih8RhjZ7">(Lotto wallet must contain sufficient funds for payout)</a>:</b>
          <br></br>1 Jackpot ticket = 10 SOL
          <br></br>5 50x tickets = 5 SOL
          <br></br>10 20x tickets = 2 SOL
          <br></br>20 10x tickets = 1 SOL
          <br></br>100 PlayAgain tickets = .1 SOL
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
