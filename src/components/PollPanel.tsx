import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';

import { Poll } from "../contexts/Polls";
import { ChoicePanel } from "./ChoicePanel";

const getResponseCount = (choice_id : number, responses : Array<[ number, number ]>) : number => {
  for (let i = 0; i < responses.length; i++ ) {
    if (responses[i][0] === choice_id) return responses[i][1]
  }
  return 0
}

export const PollPanel = (arg : {
  preview : boolean,
  poll : Poll,
  choice : number | undefined,
  bar : boolean,
  total : number,
  setChoice : React.Dispatch<React.SetStateAction<number | undefined>>
}) => {
  return <Grid2 container direction="row" justifyContent="center" alignItems="center">
    <Grid2 sx={ arg.preview ? {} : { pl : '80px', pr: '80px' }}>
        <Typography variant="h2" sx={{ mt : '80px', mb : '40px', fontFamily: 'Dancing Script', justifyContent : 'center' }}>
          { arg.poll.utterance }
        </Typography>
      </Grid2>
      <Grid2 xs={12} container justifyContent="center">
        <img src={arg.poll.img} alt={"" + arg.poll.id}  style={{ height: '220px' }}></img>
      </Grid2>
      <Grid2 md={arg.preview ? 12 : 4} sm={arg.preview ? 12 : 6} xs={12} sx={{ mt: '40px' }} container>
        { arg.poll.choices.map((label, i) => {
          return <Grid2 xs={12} key={label}>
            <ChoicePanel
              selected={arg.choice === i}
              set_choice={arg.setChoice}
              choice_id={i}
              label={label}
              bar={arg.bar}
              total={arg.total}
              responders={getResponseCount(i, arg.poll.responses)}
            />
          </Grid2>
        }) }
      </Grid2>
  </Grid2>
}
