import { useState } from 'react';

import constate from 'constate';

import { set_binder_tezos_toolkit } from '../bindings/dapp-ts';
import { Poll } from '../bindings/poll';
import { useTezos } from './Taquito';
import { usePollAddress } from './Settings';

export const [
  PollContractProvider,
  usePollContract
] = constate(
  () => {
    const tezos = useTezos()
    const address = usePollAddress()
    const [contractState] = useState({
      contract: new Poll(address),
    });
    set_binder_tezos_toolkit(tezos)
    return contractState;
  },
  (v) => v.contract
)