import './App.css';
import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';
import Home from './Home';
import squares from './images/superbowl-squares.gif';

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
        <img src={squares} alt="sample square"></img>
        <p className="myTitle">
          Welcome to Solana Squares: 🏈 SuperBowl LVI Edition!
        </p>
        <p>
          The gang here at Solana Lottery have got a little interim degen fun
          for y'all while we put the finishing touches on Game 4. If you're not
          familiar with Super Bowl Squares, it's essentially a 10x10 grid, with
          a number assigned to each column and row. At the end of each quarter
          of the game, if your set of numbers corresponds to the number at the
          end of the Home and Away teams score, you win a % of the pot!
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
          <b>Payout estimates:</b>
          <br></br>1st Quarter winner will receive 12.5% of the pot
          <br></br>2nd Quarter winner will receive 25% of the pot<br></br>3rd
          Quarter winner will receive 12.5% of the pot<br></br>Final score
          winner will receive 40% of the pot
        </div>

        <div className="footer">
          Built with love by{' '}
          <a href="http://twitter.com/web3_degen">@web3_degen</a> ❤️{' '}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
