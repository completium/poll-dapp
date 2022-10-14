import constate from 'constate';
import { useState } from 'react';

export enum UIState {
  PICK,
  RESPOND,
  ADD
}

export const [
  StateProvider,
  useAppState,
] = constate(() => {
    const [state, setState] = useState<{ ui : UIState, selected : (number | undefined) }>({
      ui : UIState.PICK,
      selected : undefined
    })
    const setPick = () => { setState(s => { return { ...s, ui : UIState.PICK, selected : undefined } }) }
    const setRespond = (id : number) => { setState(s => { return { ...s, ui : UIState.RESPOND, selected  : id } })}
    const setAdd = () => { setState(s => { return { ...s, ui : UIState.ADD, selected : undefined } }) }
    return { ui : state.ui, selected : state.selected, setPick : setPick, setRespond : setRespond, setAdd }
  }
)