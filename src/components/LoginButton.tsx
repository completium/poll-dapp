import Button from '@mui/material/Button';
import { useWalletAddress, useWalletUtils } from '../constate/BeaconWallet';
import Avatar from '@mui/material/Avatar';
import React from 'react';

import { WalletInfo } from './WalletInfo';
import { useEndpoint, useNetwork } from '../constate/Settings';
import { useTezos } from '../constate/Taquito';

export const LoginButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const tezos = useTezos()
  const network = useNetwork()
  const endpoint = useEndpoint()
  const address = useWalletAddress()
  const wallet = useWalletUtils()

  if (address)
    return <div>
      <Button onClick={handleClick} >
        <Avatar alt={address} src={"https://catava.dipdup.net/" + address} aria-haspopup="true" />
      </Button>
      <WalletInfo open={open} anchorEl={anchorEl} handlePopoverClose={handleClose} />
    </div>
  else
    return <Button color="inherit" onClick={() => wallet.connect(tezos, network, endpoint)}>
      Login
    </Button>
}