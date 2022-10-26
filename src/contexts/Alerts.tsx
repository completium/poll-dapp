import constate from 'constate';
import { useState } from 'react';

export const [
  AlertsProvider,
  useAlertOpen,
  useAlertMsg,
  useAlertSetOpen,
  useAlertSetMsg
] = constate(() => {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    return { open, msg, utils : { setAlertOpen : setOpen, setAlertMsg : setMsg } }
  },
  (v) => v.open,
  (v) => v.msg,
  (v) => v.utils.setAlertOpen,
  (v) => v.utils.setAlertMsg
)