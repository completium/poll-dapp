import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error : any = useRouteError();
  console.log(error)

  return (<Container>
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item xs={12} container direction="row" justifyContent="center" alignItems="center">
        <Typography variant="h2" sx={{ mt: '140px', mb : '60px', fontFamily: 'Dancing Script', justifyContent : 'center' }}>
          Oops!
        </Typography>
      </Grid>
      <Grid item xs={12} container direction="row" justifyContent="center" alignItems="center">
        <Typography sx={{ justifyContent : 'center', fontStyle: 'italic', color : 'gray' }}>
          Not found
        </Typography>
      </Grid>
    </Grid>
  </Container>)
}