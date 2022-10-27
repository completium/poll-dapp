import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';

import { EventAlert } from './components/EventAlert';
import { TopBar } from './components/TopBar'
import { Add } from './routes/AddPage'
import { ErrorPage } from './routes/ErrorPage'
import { Pick } from './routes/PickPage'
import { PollPage as Poll } from './routes/PollPage'
import { AlertsProvider } from './contexts/Alerts';
import { BeaconProvider } from './contexts/Beacon'
import { EventsProvider } from './contexts/Events';
import { ContractProvider } from './contexts/Contract';
import { PollDataProvider } from './contexts/Polls';
import { SettingsProvider, Theme, useTheme } from './contexts/Settings';
import { TaquitoProvider } from './contexts/Taquito';

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
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme   = useTheme()
  const uiTheme = createTheme({
    palette: {
      mode: theme === Theme.Default && prefersDarkMode ? 'dark' : (theme === Theme.Dark ? 'dark' : 'light'),
    },
  });
  return (
    <ThemeProvider theme={uiTheme}>
      <TaquitoProvider>
        <BeaconProvider>
          <ContractProvider>
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
          </ContractProvider>
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
