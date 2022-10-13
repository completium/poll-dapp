import { Address, Bytes, Nat } from "@completium/archetype-ts-types";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from "react";

import { responder_key } from "../bindings/poll";
import { useAppState } from "../store/AppState"
import { useWalletAddress, useWalletUtils } from "../store/BeaconWallet";
import { usePollContract } from "../store/PollContract";
import { getPolls, Poll, usePollUtils } from "../store/PollData"
import { useEndpoint, useNetwork } from "../store/Settings";
import { useTezos } from "../store/Taquito";
import { PollPanel } from "./PollPanel";

const getPoll = (polls : Array<Poll>, id : string) : Poll => {
  const poll = polls.find(x => x.id === id)
  if (poll !== undefined) {
    return poll
  }
  throw new Error("getPoll: '" + id + "' not found")
}

export const RespondPoll = () => {
  const [choice, setChoice] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const contract = usePollContract()
  const polls = getPolls()
  const selected = useAppState().selected
  const setPick = useAppState().setPick
  const setResponses = usePollUtils().setResponses
  if (selected === undefined) throw new Error("PollPanel : 'selected' not defined")
  const [bar, setBar] = useState(false)
  const poll = getPoll(polls, selected)
  const total = poll.responses.reduce((acc, x) => { return acc + x[1] }, 0)
  const wallet_address = useWalletAddress()
  const connect = useWalletUtils().connect
  const tezos = useTezos()
  const network = useNetwork()
  const endpoint = useEndpoint()
  const respond = async () => {
    setLoading(true)
    try {
      if (choice !== undefined) {
        if (wallet_address === undefined) {
          await connect(tezos, network, endpoint)
        }
        await contract.respond(Bytes.hex_encode(selected), new Nat(choice), {})
        setLoading(false)
        setChoice(undefined)
        const responses = await contract.view_get_responses(Bytes.hex_encode(poll.id), {})
        setResponses(poll.id, responses)
        setBar(true)
      }
    } catch(e) {
      console.log(e)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (wallet_address) {
      const load_responses = async () => {
        const responded = await contract.has_responder_value(new responder_key(Bytes.hex_encode(poll.id), new Address(wallet_address)))
        if (responded) {
          const responses = await contract.view_get_responses(Bytes.hex_encode(poll.id), {})
          setResponses(poll.id, responses)
          setBar(true)
        }
      }
      load_responses()
    }
  }, [])
  return <Container>
    <IconButton sx={{ mt: '92px', position: 'fixed' }} size="large" onClick={() => setPick()}><CloseIcon fontSize="inherit"/></IconButton>
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
  </Container>
}