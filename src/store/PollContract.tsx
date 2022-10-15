import { set_binder_tezos_toolkit } from '@completium/dapp-ts';
import constate from 'constate';
import { useState } from 'react';

import { Poll } from '../bindings/poll';
import { usePollAddress } from './Settings';
import { useTezosToolkit } from './Taquito';

export const [
  PollContractProvider,
  usePollContract
] = constate(
  () => {
    const tezos = useTezosToolkit()
    const address = usePollAddress()
    const [contractState] = useState({
      contract: new Poll(address),
    });
    set_binder_tezos_toolkit(tezos)
    return contractState;
  },
  (v) => v.contract
)