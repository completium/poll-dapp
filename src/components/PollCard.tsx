import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useNavigate } from "react-router-dom";

import { Poll } from '../contexts/Polls'

export const PollCard = (arg : { data : Poll }) => {
  const navigate = useNavigate()
  return (
    <Card sx={{ m: '18px', maxWidth: 345, cursor : 'pointer' }} onClick={() => navigate("poll/"+arg.data.hash)}>
      <CardMedia
        component="img"
        height="140"
        image={arg.data.img}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {arg.data.utterance}
        </Typography>
        <Grid2 container spacing={0}>
          <Grid2 xs={12}>
            <Typography variant="body2" color="text.secondary">
              { arg.data.choices.length } possible responses.
            </Typography>
          </Grid2>
          <Grid2 xs={12}>
            <Typography variant="body2" color="text.secondary">
              { arg.data.responses.reduce((acc,v) => { return (acc + v[1]) }, 0) } have already responded.
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}