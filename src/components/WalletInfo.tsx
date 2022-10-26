import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';

import { useDisconnect, useWalletAddress, useWalletName } from '../contexts/Beacon';
import { useEndpoint, useNetwork } from '../contexts/Settings';
import { useTezosToolkit } from '../contexts/Taquito';

export const Address = (arg : { address : string | undefined }) => {
  return <Grid2 container spacing={0} alignItems="flex-end">
    <Grid2 xs={5}>
      <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'monospace' }}>
        {arg.address ? arg.address.slice(0,9) : ""}
      </Typography>
    </Grid2>
    <Grid2 xs={1}>
      <MoreHorizIcon sx={{mb : '6px'}} />
    </Grid2>
    <Grid2 xs={6}>
      <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'monospace' }}>
        {arg.address ? arg.address.slice(arg.address.length - 9) : ""}
      </Typography>
    </Grid2>
  </Grid2>
}

export const WalletInfo = (arg : { open : boolean, anchorEl : HTMLElement | null, handlePopoverClose : () => void }) => {
  const [balance, setBalance] = useState("...")
  const wallet = useWalletName()
  const address = useWalletAddress()
  const endpoint = useEndpoint()
  const network = useNetwork()
  const ttk = useTezosToolkit()
  const disconnect = useDisconnect()
  useEffect(() => {
    if (address) ttk.tz.getBalance(address).then(b => {
      setBalance(""+b.dividedBy(1000000).toNumber()+"ꜩ")
    })
  })
  return <Popover
    id={arg.open ? 'simple-popover' : undefined}
    open={arg.open}
    anchorEl={arg.anchorEl}
    onClose={arg.handlePopoverClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
  >
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Address address={address} />
        <Grid2 container>
          <Grid2 xs={3}>
            <Typography variant="body2" color="text.secondary">Wallet:</Typography>
          </Grid2>
          <Grid2 xs={9}>
            <Typography variant="body2">{wallet}</Typography>
          </Grid2>
          <Grid2 xs={3}>
            <Typography variant="body2" color="text.secondary">Balance:</Typography>
          </Grid2>
          <Grid2 xs={9}>
            <Typography variant="body2">{balance}</Typography>
          </Grid2>
          <Grid2 xs={3}>
            <Typography variant="body2" color="text.secondary">Network:</Typography>
          </Grid2>
          <Grid2 xs={9}>
            <Typography variant="body2">{network}</Typography>
          </Grid2>
          <Grid2 xs={3}>
            <Typography variant="body2" color="text.secondary">Endpoint:</Typography>
          </Grid2>
          <Grid2 xs={9}>
            <Typography variant="body2">{endpoint}</Typography>
          </Grid2>
        </Grid2>
      </CardContent>
      <CardActions sx={{ ml: 'auto', justifyContent: 'center' }}>
        <Button size="small" onClick={disconnect}>Logout</Button>
      </CardActions>
    </Card>
  </Popover>
}