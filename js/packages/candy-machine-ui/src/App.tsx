import './App.css';
import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';
import Home from './Home';
import squares from './images/6.png';

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
        <img src={squares} width={300} alt="sample square"></img>
        <p>
          <p className="myTitle">
            Welcome to Solana Squares: SuperBowl LVI Edition!
          </p>
          <p>
          In collaboration with <a href="mickeydegods.com">Mickey DeGods</a>,
          we've got a little interim degen fun for y'all while we put the
          finishing touches on Game 4. If you're not familiar with Super Bowl
          Squares, it's essentially a 10x10 grid, with a number assigned to each
          column and row. At the end of each quarter of the game, if your set of
          numbers corresponds to the number at the end of the Home and Away
          teams score, you win a % of the pot!</p><p><b>EXAMPLE:</b><br></br>If at half time
          the score is 17-21, whoever holds the NFT with 7-1 on it wins!</p>
          We have three different priced boards with 100 NFTs on
          each:<br></br>
          <p><b>
            0.25 SOL<br></br>
            0.5 SOL<br></br>1 SOL<br></br></b>
          </p>
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

        <div className='description'><b>Payouts will be as follows:</b><br></br>1st Quarter winner will receive
          12.5% of the pot (≈ 12.5x mint)<br></br>2nd Quarter (Halftime) winner will
          receive 25% of the pot (≈ 25x mint)<br></br>3rd Quarter winner will receive
          12.5% of the pot (≈ 12.5x mint) <br></br>Final score winner will receive 40% of
          the pot (≈ 40x mint)</div>

        <div className="footer">Footer here</div>
      </ThemeProvider>
    </div>
  );
};

export default App;
