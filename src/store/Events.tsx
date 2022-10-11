import { EventData } from "@completium/event-listener"
import { run_listener } from "@completium/event-listener";
import constate from "constate";
import { useCallback, useEffect, useState } from "react";

import { useEndpoint } from "./Settings";

export const eventMockup : EventData = {
  block : "BL1iKL7XjsMNREMYerhAkC9C8hdnBYrq4mF72c9PkyBk3cLQFQJ",
  op : "onna7P1tgB8UYDyDZGn8xACiNoEbCotQ1CNGtL4tdhXrnGSQ38d",
  source : "KT19EAMugKU416cbA9jL1XcukWArfpv4dLYu",
  time : (new Date()).toISOString(),
  evtype : 'SwitchOn'
}

function useEventsState() {
  const [events, setEvents] = useState<Array<EventData>>([]);
  const [nbNewEvents, setNbEvents] = useState(0);
  const endpoint = useEndpoint()
  const openEvents = useCallback(() => setNbEvents(prev => 0), [])
  const addEvent = useCallback((e : EventData) => {
      setEvents(prev => prev.concat([e]))
      setNbEvents(prev => prev + 1)
  }, [])
  const clearEvents = useCallback(() => {
    setEvents([])
    setNbEvents(0)
  }, [])
  useEffect(() => {
    const startListener = async () => {
      console.log("running event listener")
      await run_listener({
        endpoint: endpoint,
        verbose: true,
        horizon: 2
      })
    };
    startListener()
  })
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