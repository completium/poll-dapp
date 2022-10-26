import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { EventAlert } from './components/EventAlert';
import { TopBar } from './components/TopBar'
import { Add } from './routes/AddPage'
import { ErrorPage } from './routes/ErrorPage'
import { Pick } from './routes/PickPage'
import { PollPage as Poll } from './routes/PollPage'
import { AlertsProvider } from './store/Alerts';
import { BeaconProvider } from './store/Beacon'
import { EventsProvider } from './store/Events';
import { PollContractProvider } from './store/PollContract';
import { PollDataProvider } from './store/Polls';
import { SettingsProvider, Theme, useTheme } from './store/Settings';
import { TaquitoProvider } from './store/Taquito';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/poll-dapp",
    element: <Pick />,
  },
  {
    path: "/poll-dapp/add",
    element: <Add />,
  },
  {
    path: "/poll-dapp/poll/:hash",
    element: <Poll />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

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
            <PollDataProvider>
              <AlertsProvider>
                <EventsProvider>
                  <Paper elevation={0}>
                    <div style={{ height: '100vh', overflow: 'auto' }}>
                    <TopBar></TopBar>
                    <RouterProvider router={router} />
                    <EventAlert />
                    </div>
                  </Paper>
                </EventsProvider>
              </AlertsProvider>
            </PollDataProvider>
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
