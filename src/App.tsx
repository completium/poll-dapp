import { BeaconWalletProvider } from './constate/BeaconWallet'
import { SettingsProvider, Theme, useTheme } from './constate/Settings';
import { PollContractProvider } from './constate/PollContract';
import { TezosProvider } from './constate/Taquito';
import { TopBar } from './components/TopBar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import { PickPoll } from './components/PickPoll';
import { PollDataProvider } from './constate/PollData';
import { StateProvider, UIState, useAppState } from './constate/AppState';
import { PollPanel } from './components/PollPanel';
import { AddPoll } from './components/AddPoll';

function MainPanel () {
  const state = useAppState()
  switch (state.ui) {
    case (UIState.PICK)    : return <PickPoll />
    case (UIState.ADD)     : return <AddPoll />
    case (UIState.RESPOND) : return <PollPanel />
  }
}

function DApp() {
  const theme   = useTheme()
  const uiTheme = createTheme({
    palette: {
      mode: theme === Theme.Dark ? 'dark' : 'light',
    },
  });
  return (
    <ThemeProvider theme={uiTheme}>
      <TezosProvider>
        <BeaconWalletProvider>
          <PollContractProvider>
            <StateProvider>
              <PollDataProvider>
                <Paper elevation={0}>
                  <div style={{ height: '100vh', overflow: 'auto' }}>
                    <TopBar></TopBar>
                    <MainPanel />
                  </div>
                </Paper>
              </PollDataProvider>
            </StateProvider>
          </PollContractProvider>
        </BeaconWalletProvider>
      </TezosProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <SettingsProvider>
        <DApp />
      </SettingsProvider>
    </div>
  );
}

export default App;
