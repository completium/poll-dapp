import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

import { useAlertMsg, useAlertOpen, useAlertSetOpen } from '../contexts/Alerts';

// source : https://mui.com/material-ui/react-snackbar/#main-content
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const EventAlert = () => {
  const open = useAlertOpen()
  const msg  = useAlertMsg()
  const setAlertOpen = useAlertSetOpen()
  const handleClose = () => {
    setAlertOpen(false)
  }
  return <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
      {msg}
    </Alert>
  </Snackbar>
}