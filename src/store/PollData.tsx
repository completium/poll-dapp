import { Nat } from '@completium/archetype-ts-types';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { poll_container } from '../bindings/poll';

import { usePollContract } from './PollContract';
import { useIPFSBrowser } from './Settings';

// Food    : QmZ8GxAwPvVDEtGxyUmfbB1dtmrdDR6tmMv9HUATaippqU
// Dancer  : QmbceSQoFzPYAUNnVfmc4juYDm4C4ZN3HrdJu3VfuxNGVR
// Squares : QmdmFzdsfiAoTF3DaFBuNS6BGYye8q5nZCugrbsf9G3NgJ

export interface Poll {
  id : string,
  utterance : string,
  img : string,
  choices : Array<string>
  responses : Array<[ number, number]>
}

export type UIPoll = Omit<Poll, "id" | "responses">

export const [
  PollDataProvider,
  getPolls,
  usePollUtils,
  //useSurveyUtils
] = constate(() => {
    const [ polls, setPolls ] = useState<Array<Poll>>([])
    const ipfs = useIPFSBrowser()
    const contract = usePollContract()

    const loadData = async () => {
      const polls = new Array<Poll>()
      const poll_data = await contract.get_poll()
      for(let i=0; i < poll_data.length; i++) {
        let hash = poll_data[i][0].hex_decode()
        let url = ipfs + hash
        const res = await fetch(url)
        const ui  = await res.json()
        polls.push({
          ...ui,
          id : hash,
          responses : poll_data[i][1].map(x => [ x[0].to_big_number().toNumber(), x[1].to_big_number().toNumber() ])
        })
      }
      setPolls(polls)
    }

    useEffect(() => {
      // load polls' ui data
      loadData()
    }, [])
    const setResponses = (id : string, r : Array<[ Nat, Nat ]>) => {
      setPolls(ps => {
        return ps.map(p => {
          if (p.id === id) {
            return { ...p, responses : r.map(x => [ x[0].to_big_number().toNumber(), x[1].to_big_number().toNumber() ]) }
          } else return p
        })
      })
    }
    return { polls, utils : { setResponses, loadData } }
  },
  (v) => v.polls,
  (v) => v.utils
)