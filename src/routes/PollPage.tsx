import { Address, Nat } from "@completium/archetype-ts-types";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { PollPanel } from "../components/PollPanel";
import { useConnect, useIsConnected, useWalletAddress } from "../contexts/Beacon";
import { useContract } from "../contexts/Contract";
import { Poll, useLoadResponses, usePolls, useLoadData } from "../contexts/Polls"

const getPoll = (polls : Array<Poll>, hash : string | undefined) : Poll | undefined => {
  const poll = polls.find(x => x.hash === hash)
  if (poll !== undefined) {
    return poll
  }
  return undefined
}

export const PollPage = () => {
  const [refresh, setRefresh] = useState(false)
  const [choice, setChoice] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const contract = useContract()
  const polls = usePolls()
  const { hash } = useParams()
  const poll = getPoll(polls, hash)
  const loadData = useLoadData()
  const loadResponses = useLoadResponses()
  const [bar, setBar] = useState(false)
  const total = poll ? poll.responses.reduce((acc, x) => { return acc + x[1] }, 0) : 0
  const wallet_address = useWalletAddress()
  const connect =useConnect()
  const is_connected = useIsConnected()
  const respond = async () => {
    setLoading(true)
    try {
      if (poll !== undefined && choice !== undefined) {
        if (!is_connected()) {
          await connect()
        }
        await contract.respond(new Nat(poll.id), new Nat(choice), {})
        setLoading(false)
        setChoice(undefined)
        await loadResponses(poll.id)
        setBar(true)
      }
    } catch(e) {
      console.log(e)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (poll) {
      if (wallet_address) {
        const load_responses = async () => {
          const responded = await contract.view_already_responded(new Nat(poll.id), { as : new Address(wallet_address) })
          if (responded) {
            await loadResponses(poll.id)
            setBar(true)
          }
        }
        load_responses()
      }
    } else {
      const load_data = async () => {
        await loadData()
      }
      load_data()
      setRefresh(!refresh)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll])
  return (poll ? <Container>
    <IconButton sx={{ mt: '92px', position: 'fixed' }} size="large" onClick={() => navigate("/poll-dapp")}><CloseIcon fontSize="inherit"/></IconButton>
    <Grid2 container direction="row" justifyContent="center" alignItems="center">
      <PollPanel preview={false} poll={poll} choice={choice} setChoice={setChoice} bar={bar} total={total}/>
      <Grid2 xs={12} sx={{ mt : '18px', mb : '18px' }} container justifyContent='center'>
        <LoadingButton
          onClick={respond}
          loading={loading}
          endIcon={<SendIcon />}
          disabled={choice === undefined}>
          Submit
        </LoadingButton>
      </Grid2>
    </Grid2>
  </Container> : <div/>)
}