import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
//import Grid2 from '@mui/material/Grid2';
import Grid2 from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { APPPanel, useSetAppPanel } from '../store/AppState';
import { usePolls } from '../store/Polls';
import { PollCard } from './PollCard';

export const PickPoll = () => {
  const set_panel = useSetAppPanel()
  const set_add = () => set_panel(APPPanel.ADD)
  const polls = usePolls()
  return <Container>
    <Grid2 container direction="row" justifyContent="center" alignItems="center">
      <Grid2>
        <Typography variant="h2" sx={{ mt: '140px', mb : '60px', fontFamily: 'Dancing Script', justifyContent : 'center' }}>
          Give your opinion!
        </Typography>
      </Grid2>
      <Grid2 item xs={12}>
        <Grid2 container justifyContent="center" alignItems="center" spacing={4}>
          { polls.map((s,i) => {
              return <Grid2 item key={"survey_"+i} md={4} sm={6} xs={12}>
                <Grid2 container justifyContent='center'>
                  <PollCard data={s}/>
                </Grid2>
              </Grid2>
            })
          }
        </Grid2>
      </Grid2>
      <Grid2 container direction="row" justifyContent="center" alignItems="center" sx={{ mt : '12px', mb: '18px' }}>
        <Grid2>
          <Typography variant="h5" sx={{ fontFamily : 'Dancing Script' }}>Want a new poll?</Typography>
        </Grid2>
        <Grid2>
          <Button onClick={set_add} sx={{ ml: '18px', mt : '4px' }}>add poll</Button>
        </Grid2>
      </Grid2>
    </Grid2>
  </Container>
}