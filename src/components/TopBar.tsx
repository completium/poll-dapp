import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { LoginButton } from './LoginButton';
import { ThemeSwitch } from './ThemeSwitch';
import { GitHubLink } from './GitHubLink';

export const TopBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <ThemeSwitch />
          <GitHubLink />
          <LoginButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
