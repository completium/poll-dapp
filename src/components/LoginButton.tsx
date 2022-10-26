import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import React from 'react';

import { useConnect, useWalletAddress } from '../contexts/Beacon';
import { WalletInfo } from './WalletInfo';

export const LoginButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const address = useWalletAddress()
  const connect = useConnect()

  if (address)
    return <div>
      <Button onClick={handleClick} >
        <Avatar alt={address} src={"https://catava.dipdup.net/" + address} aria-haspopup="true" />
      </Button>
      <WalletInfo open={open} anchorEl={anchorEl} handlePopoverClose={handleClose} />
    </div>
  else
    return <Button color="inherit" onClick={connect}>
      Login
    </Button>
}