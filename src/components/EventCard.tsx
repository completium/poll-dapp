import { EventData } from "@completium/event-listener"
import styled from '@emotion/styled';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { Grid, SvgIconProps, Typography } from "@mui/material"
import { LinkBaseProps } from "@mui/material";
import { SvgIcon } from "@mui/material";
import Link from '@mui/material/Link';
import { useTheme } from "@mui/material/styles";
import Tooltip from '@mui/material/Tooltip';
import { forwardRef } from "react";

import { useNetwork } from "../contexts/Settings";

export type EventCardProps = {
  data : EventData
}

const getBlockUrl = (network : string, hash : string) : string => {
  return `https://${network}.tzkt.io/${hash}/operations`
}

const getOpUrl = (network : string, hash : string) : string => {
  return `https://better-call.dev/${network}/opg/${hash}/contents`
}

const getContractUrl = (network : string, addr : string) : string => {
  return `https://better-call.dev/${network}/${addr}/operations`
}

const HashTypography = styled(Typography)({
  fontFamily : "'Roboto Mono', monospace"
})

const HashLink = forwardRef((props : LinkBaseProps, ref : any) => {
  return (<Link {...props} ref={ref} target="_blank" underline="none" />
)})

const GreyIcon = forwardRef((props : SvgIconProps, ref : any) => {
  const theme = useTheme()
  const grey = theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400]
  return (
    <SvgIcon {...props} ref={ref} style={{ color : grey }} />
  )
})

export const EventCard = (props : EventCardProps) => {
  const theme = useTheme()
  const network = useNetwork()
  const grey = theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400]
  return (
    <Grid container style={{ padding: "10px", borderBottom: "1px solid", borderColor: grey }}>
      <Grid item xs={1}>
        <Tooltip title="Block date">
          <GreyIcon><AccessTimeIcon /></GreyIcon>
        </Tooltip>
      </Grid>
      <Grid item xs={11}>
        <Typography>{props.data.time}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Block hash">
          <GreyIcon><WidgetsIcon/></GreyIcon>
        </Tooltip>
      </Grid>
      <Grid item xs={11}>
        <HashLink href={getBlockUrl(network, props.data.block)}>
          <HashTypography>
            {props.data.block}
          </HashTypography>
        </HashLink>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Operation hash">
          <GreyIcon><ViewHeadlineIcon/></GreyIcon>
        </Tooltip>
      </Grid>
      <Grid item xs={11}>
        <HashLink href={getOpUrl(network, props.data.op)}>
          <HashTypography>
            {props.data.op}
          </HashTypography>
        </HashLink>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Source">
          <GreyIcon><ReceiptIcon/></GreyIcon>
        </Tooltip>
      </Grid>
      <Grid item xs={11}>
        <HashLink href={getContractUrl(network, props.data.source)}>
          <HashTypography>
            {props.data.source}
          </HashTypography>
        </HashLink>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Event Type">
          <GreyIcon><CategoryIcon/></GreyIcon>
        </Tooltip>
      </Grid>
      <Grid item xs={11}>
        <HashTypography>
          {props.data.evtype}
        </HashTypography>
      </Grid>
    </Grid>
  )
}
