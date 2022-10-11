import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AddPoll } from './components/AddPoll';
import { PickPoll } from './components/PickPoll';
import { RespondPoll } from './components/RespondPoll';
import { TopBar } from './components/TopBar'
import { StateProvider, UIState, useAppState } from './store/AppState';
import { BeaconWalletProvider } from './store/BeaconWallet'
import { EventsProvider } from './store/Events';
import { PollContractProvider } from './store/PollContract';
import { PollDataProvider } from './store/PollData';
import { SettingsProvider, Theme, useTheme } from './store/Settings';
import { TezosProvider } from './store/Taquito';

import './App.css';

function MainPanel () {
  const state = useAppState()
  switch (state.ui) {
    case (UIState.PICK)    : return <PickPoll />
    case (UIState.ADD)     : return <AddPoll />
    case (UIState.RESPOND) : return <RespondPoll />
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
                <EventsProvider>
                  <Paper elevation={0}>
                    <div style={{ height: '100vh', overflow: 'auto' }}>
                      <TopBar></TopBar>
                      <MainPanel />
                    </div>
                  </Paper>
                </EventsProvider>
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
