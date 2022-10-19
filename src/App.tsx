import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AddPoll } from './components/AddPoll';
import { EventAlert } from './components/EventAlert';
import { PickPoll } from './components/PickPoll';
import { RespondPoll } from './components/RespondPoll';
import { TopBar } from './components/TopBar'
import { AlertsProvider } from './store/Alerts';
import { StateProvider, APPPanel, useAppPanel } from './store/AppState';
import { BeaconProvider } from './store/Beacon'
import { EventsProvider } from './store/Events';
import { PollContractProvider } from './store/PollContract';
import { PollDataProvider } from './store/Polls';
import { SettingsProvider, Theme, useTheme } from './store/Settings';
import { TaquitoProvider } from './store/Taquito';

import './App.css';

function MainPanel () {
  const state = useAppPanel()
  switch (state) {
    case (APPPanel.PICK)    : return <PickPoll />
    case (APPPanel.ADD)     : return <AddPoll />
    case (APPPanel.RESPOND) : return <RespondPoll />
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
      <TaquitoProvider>
        <BeaconProvider>
          <PollContractProvider>
            <StateProvider>
              <PollDataProvider>
                <AlertsProvider>
                  <EventsProvider>
                    <Paper elevation={0}>
                      <div style={{ height: '100vh', overflow: 'auto' }}>
                        <TopBar></TopBar>
                        <MainPanel />
                        <EventAlert />
                      </div>
                    </Paper>
                  </EventsProvider>
                </AlertsProvider>
              </PollDataProvider>
            </StateProvider>
          </PollContractProvider>
        </BeaconProvider>
      </TaquitoProvider>
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
