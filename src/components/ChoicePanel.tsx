import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import React from 'react';

const getIdIcon = (id : number, selected : boolean) => {
  switch (id) {
    case 1 : return <Filter1Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 2 : return <Filter2Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 3 : return <Filter3Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 4 : return <Filter4Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 5 : return <Filter5Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 6 : return <Filter6Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 7 : return <Filter7Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 8 : return <Filter8Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    case 9 : return <Filter9Icon fontSize="small" color={ selected ? 'inherit' : 'disabled'} sx={{ mt : '6px' }}/>
    default : throw new Error("getIdIcon: id not handled '" + id + "'")
  }
}

const getGradient = (firstcolor : string, secondColor : string, ratio : number) => {
  const percent = (ratio * 100).toFixed()
  return "linear-gradient(90deg, " + firstcolor + " " + percent + "%, " + secondColor + " " + percent + "%)"
}

export const ChoicePanel  = (arg : {
  choice_id : number,
  label : string,
  selected : boolean,
  bar : boolean,
  total : number,
  responders : number
  set_choice : React.Dispatch<React.SetStateAction<number | undefined>>
}) => {
  const ratio =  arg.responders / arg.total
  const theme = useTheme()
  const [e, setElevation] = useState(1)
  const baseStyle = { mt : '12px', bt : '12px', p : '8px' }
  const style = { ...baseStyle,
    cursor : 'pointer',
    backgroundColor : arg.selected ? theme.palette.info.main : 'inherit',
  }
  const barStyle = {
    ...baseStyle,
    background : getGradient(theme.palette.info.main, "rgba(255, 255, 255, 0.05)", ratio)
  }
  const handleClick = () => {
    if (arg.bar) return;
    arg.set_choice(arg.selected ? undefined : arg.choice_id)
  }
  return <Paper
    elevation={e}
    onMouseOver={() => arg.selected ? setElevation(1) : setElevation(4)}
    onMouseLeave={() => setElevation(1)}
    onClick = { handleClick }
    sx={ arg.bar ? barStyle : style }
  >
    <Grid2 container direction='row'>
      <Grid2 xs={2} sx={{ ml: '12px' }}>
        { getIdIcon(arg.choice_id + 1, arg.selected) }
      </Grid2>
      <Grid2 xs={8}>
        <Typography variant='h6'>{ arg.label }</Typography>
      </Grid2>
      {
        arg.bar ?
        <Grid2 sx={{ mt: '6px' }}>
          <Typography variant='body2' color="text.secondary"> ({arg.responders}) </Typography>
        </Grid2> : <div></div>
      }
    </Grid2>
  </Paper>
}