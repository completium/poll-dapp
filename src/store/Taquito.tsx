import { TezosToolkit } from '@taquito/taquito';
import { useState } from 'react';

import constate from 'constate';
import { useEndpoint } from './Settings';

export const [
  TezosProvider,
  useTezos
] = constate(
  () => {
    const endpoint = useEndpoint()
    const tezos    = new TezosToolkit(endpoint)
    const [taquitoState] = useState(() : { tezos : TezosToolkit } => ({
      tezos: tezos,
    }));
    return taquitoState;
  },
  (v) => v.tezos,
);

