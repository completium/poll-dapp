import { Bytes } from '@completium/archetype-ts-types';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { PollPanel } from '../components/PollPanel';
import { useConnect, useIsConnected } from '../contexts/Beacon';
import { useContract } from '../contexts/Contract';
import { UIPoll, useLoadData } from '../contexts/Polls';
import { Poll } from '../contexts/Polls';
import { useIPFSBrowser } from '../contexts/Settings';

const AddForm = (arg : { setUIPoll : React.Dispatch<React.SetStateAction<UIPoll | undefined>> }) => {
  const [uri, setURI] = React.useState('');
  const [error, setError] = React.useState(false);
  const [isValidURI, setIsValidURI] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const ipfsBrowser = useIPFSBrowser()
  const contract = useContract()
  const loadData = useLoadData()
  const navigate = useNavigate()
  const connect = useConnect()
  const is_connected = useIsConnected()
  const addPoll = async () => {
    setLoading(true)
    try {
      if (!is_connected()) {
        await connect()
      }
      await contract.add_poll(Bytes.hex_encode(uri), {})
      await loadData()
      setLoading(false)
      setIsValidURI(false)
      navigate("/poll-dapp")
    } catch (e) {
      setLoading(false)
    }
  }
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    try {
      setURI(url);
      setError(false);
      if (url !== "") {
        const res = await fetch(ipfsBrowser + url)
        const uip : UIPoll = await res.json()
        arg.setUIPoll(uip)
        setIsValidURI(true)
      } else {
        arg.setUIPoll(undefined)
        setIsValidURI(false)
      }
    } catch(e) {
      setError(true);
      setIsValidURI(false)
      console.log(e)
    }
  };
  return <Grid2 container justifyContent="flex-end" alignItems="center" sx={{ m: '28px' }} spacing={2}>
    <Grid2 xs={12}>
      <TextField
        fullWidth
        variant="outlined"
        id="ipfh-field"
        label="IPFS Hash"
        value={uri}
        onChange={handleChange}
        error={error}
        helperText={ error ? "Invalid Hash" : '' }
      />
    </Grid2>
    <Grid2>
      <LoadingButton
        onClick={addPoll}
        loading={loading}
        variant='contained'
        endIcon={<SendIcon />}
        disabled={!isValidURI}>
        Submit
      </LoadingButton>
    </Grid2>
  </Grid2>
}

const PollPreview = (arg : { uip : UIPoll | undefined }) => {
  if (arg.uip === undefined) {
    return <Grid2 container justifyContent="center" sx={{ height: '100%' }}>
        <Grid2 xs={12} sx={{ p: 2, border: '1px dashed grey', height: '100%' }} container justifyContent="center" alignItems="center" >
          <Grid2>
            <Typography color="text.secondary">Preview</Typography>
          </Grid2>
        </Grid2>
      </Grid2>
  } else {
    const setChoice : React.Dispatch<React.SetStateAction<number | undefined>> = n => {}
    const poll : Poll = { ...arg.uip, id : 0, responses : [] }
    return <Box sx={{ p: 2, border: '1px dashed grey' }}>
        <PollPanel
        preview={true}
        poll={poll}
        choice={undefined}
        total={0}
        bar={false}
        setChoice={setChoice}
      />
      </Box>
  }
}

export const Add = () => {
  const [uiPoll, setUIPoll] = React.useState<UIPoll | undefined>(undefined)
  return <Container style={{ height: '100vh' }}>
    <IconButton component={Link} sx={{ top : '72px', position: 'absolute' }} size="large" to="/poll-dapp"><CloseIcon fontSize="inherit"/></IconButton>
    <Grid2 container justifyContent="center" alignItems="center" sx={{ height : 'calc(100% - 280px)', mt: '140px', mb : '140px' }}>
      <Grid2 md={6} xs={12}>
        <AddForm setUIPoll={setUIPoll} />
      </Grid2>
      <Grid2 md={6} xs={12} sx={{ height: '100%' }}>
        <PollPreview uip={uiPoll} />
      </Grid2>
    </Grid2>
  </Container>
}