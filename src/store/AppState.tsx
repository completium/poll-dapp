import constate from 'constate';
import { useState } from 'react';

export enum APPPanel {
  PICK,
  RESPOND,
  ADD
}

export const [
  StateProvider,
  useAppPanel,
  useAppPoll,
  useSetAppPanel,
  useSetAppPoll
] = constate(() => {
    const [state, setState] = useState<{ panel : APPPanel, poll : (number | undefined) }>({
      panel : APPPanel.PICK,
      poll : undefined
    })
    const set_panel = (p : APPPanel) => setState(s => { return { ...s, panel : p }})
    const set_poll = (p : number) => setState(s => { return { ...s, panel: APPPanel.RESPOND, poll : p }})
    return { state, set_panel, set_poll }
  },
  (v) => v.state.panel,
  (v) => v.state.poll,
  (v) => v.set_panel,
  (v) => v.set_poll
)