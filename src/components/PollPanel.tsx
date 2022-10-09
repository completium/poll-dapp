import { useAppState } from "../constate/AppState"
import { getPolls, Poll, usePollUtils } from "../constate/PollData"
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { PollUI } from "./PollUI";
import { usePollContract } from "../constate/PollContract";
import { Bytes, Nat } from "@completium/archetype-ts-types";

const getPoll = (polls : Array<Poll>, id : string) : Poll => {
  const poll = polls.find(x => x.id === id)
  if (poll !== undefined) {
    return poll
  }
  throw new Error("getPoll: '" + id + "' not found")
}

export const PollPanel = () => {
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
  const respond = async () => {
    setLoading(true)
    try {
      console.log(choice)
      if (choice !== undefined) {
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
  return <Container>
    <IconButton sx={{ mt: '92px', position: 'fixed' }} size="large" onClick={() => setPick()}><CloseIcon fontSize="inherit"/></IconButton>
    <Grid2 container direction="row" justifyContent="center" alignItems="center">
      <PollUI preview={false} poll={poll} choice={choice} setChoice={setChoice} bar={bar} total={total}/>
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