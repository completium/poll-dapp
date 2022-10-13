import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import React from 'react';
import { useTezos } from "./Taquito";
import { useAppName, useNetwork } from "./Settings";

import constate from 'constate';

export const [
  BeaconWalletProvider,
  useBeaconWallet,
  useWalletAddress,
  useWalletUtils,
] = constate(
  MakeBeaconWallet,
  (v) => v.beaconState.wallet,
  (v) => v.beaconState.user_address,
  (v) => v.utils
);

function MakeBeaconWallet() {
  const network = useNetwork()
  const name = useAppName()
  const tezos = useTezos()

  const [beaconState, setState] = React.useState(() : {
    wallet : undefined | BeaconWallet,
    user_address : undefined | string
  } => ({
    wallet       : new BeaconWallet({ name : name, preferredNetwork : network }),
    user_address : undefined
  }));

  React.useEffect(() => {
    // to be executed on mount
    tezos.setWalletProvider(beaconState.wallet)
    beaconState.wallet?.client.getActiveAccount().then(account => {
      let address : string | undefined = undefined
      if(account) {
        address = account.address
      }
      setState(s => { return { ...s, user_address : address }})
    })
  }, []);

  const connect = async (tezos : TezosToolkit, network : NetworkType, endpoint : string) => {
    try {
      let wallet :  BeaconWallet | undefined = undefined
      if (beaconState.wallet) {
        wallet = beaconState.wallet
        tezos.setWalletProvider(wallet);
        await wallet.requestPermissions({
          network : {
            type : network,
            rpcUrl : endpoint
          }
        })
        const address = await wallet.getPKH();
        setState(s => { return { ...s, user_address : address }})
      } else {
        throw new Error("Beacon Wallet Not Initialized")
      }
    } catch(e) {
      console.log(e)
    }
  }

  const disconnect = async () => {
    beaconState.wallet?.client.disconnect()
    setState(s => { return { ...s,
      user_address : undefined
    }})
  }

  return { beaconState, utils : { connect, disconnect } };
}
