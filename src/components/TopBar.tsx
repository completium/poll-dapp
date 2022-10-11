import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { EventNotifications } from './EventNotifications';
import { GitHubLink } from './GitHubLink';
import { LoginButton } from './LoginButton';
import { TezosIcon } from './TezosIcon';
import { ThemeSwitch } from './ThemeSwitch';

export const TopBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <TezosIcon />
          <ThemeSwitch />
          <GitHubLink />
          <EventNotifications />
          <LoginButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
