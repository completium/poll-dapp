import { EventData } from "@completium/event-listener"
import { run_listener } from "@completium/event-listener";
import { AppBarProps } from "@mui/material";
import constate from "constate";
import { useCallback, useEffect, useState } from "react";

import { ApprovePoll, NewPoll, Response } from '../bindings/poll'
import { useAlertUtils } from "./Alerts";
import { usePollContract } from "./PollContract";
import { usePollUtils } from "./PollData";
import { useEndpoint } from "./Settings";

const make_response_msg = (r : Response) : string => {
  return `${r.responder_addr} submitted new opinion!`
}

const make_new_poll_msg = (np : NewPoll) : string => {
  return `${np.creator} added new poll!`
}

const make_poll_confirmed_msg = (np : ApprovePoll) : string => {
  return `owner approved poll ${np.poll_id.hex_decode()}`
}

function useEventsState() {
  const [events, setEvents] = useState<Array<EventData>>([]);
  const [nbNewEvents, setNbEvents] = useState(0);
  const endpoint = useEndpoint()
  const contract = usePollContract()
  const setAlertMsg = useAlertUtils().setAlertMsg
  const setAlerOpen = useAlertUtils().setAlertOpen
  const openEvents = useCallback(() => setNbEvents(prev => 0), [])
  const setResponses = usePollUtils().setResponses
  const addEvent = useCallback((e : EventData) => {
      setEvents(prev => [e].concat(prev))
      setNbEvents(prev => prev + 1)
  }, [])
  const clearEvents = useCallback(() => {
    setEvents([])
    setNbEvents(0)
  }, [])
  useEffect(() => {
    const startListener = async () => {
      contract.register_Response(async (e : Response, d ?: EventData) => {
        setAlertMsg(make_response_msg(e))
        setAlerOpen(true)
        const responses = await contract.view_get_responses(e.poll_id, {})
        setResponses(e.poll_id.hex_decode(), responses)
        if (d) addEvent(d)
      })
      contract.register_NewPoll((np : NewPoll, d ?: EventData) => {
        setAlertMsg(make_new_poll_msg(np))
        setAlerOpen(true)
        if (d) addEvent(d)
      })
      contract.register_ApprovePoll((ap : ApprovePoll, d ?: EventData) => {
        setAlertMsg(make_poll_confirmed_msg(ap))
        setAlerOpen(true)
        if (d) addEvent(d)
      })
      await run_listener({
        endpoint: endpoint,
        verbose: false,
        horizon: 0
      })
    };
    startListener()
  }, [])
  return { events, nbNewEvents, openEvents, addEvent, clearEvents };
}

export const [EventsProvider, useEvents, useNbNewEvents, useOpenEvents, useAddEvent, useClearEvents] = constate(
  useEventsState,
  value => value.events,
  value => value.nbNewEvents,
  value => value.openEvents,
  value => value.addEvent, // becomes useSwitchOn
  value => value.clearEvents, // becomes useSwitchOff
);