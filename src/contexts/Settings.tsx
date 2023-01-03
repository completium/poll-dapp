import { NetworkType } from "@airgap/beacon-sdk";
import useMediaQuery from '@mui/material/useMediaQuery';
import constate from "constate";
import { useState } from 'react';

export enum Theme {
  Default,
  Light,
  Dark
}

const switch_theme = (t : Theme, defaultDark : boolean) : Theme => {
  switch (t) {
    case Theme.Default : return defaultDark ? Theme.Light : Theme.Dark
    case Theme.Light   : return Theme.Dark
    case Theme.Dark    : return Theme.Light
  }
}

export const [
  SettingsProvider,
  useTheme,
  useAppName,
  useEndpoint,
  useContractAddress,
  useNetwork,
  useIPFSBrowser,
  useGitRepo,
  useHelpUrl,
  useSwitchTheme,
] = constate(
  () => {
    const [settingState, setState] = useState({
      app_name        : 'Poll DAPP',
      endpoint        : 'https://ghostnet.ecadinfra.com',
      contract        : 'KT1FcUNmyZ255yyfqWL3GC1AGqSY2vKqYwEg',
      ipfs_browser    : 'https://gateway.pinata.cloud/ipfs/',
      network         :  NetworkType.GHOSTNET,
      theme           :  Theme.Default,
      git_repo        : 'https://github.com/completium/poll-dapp/tree/main',
      help            : 'https://archetype-lang.org/docs/dapps/example/'
    });
    const defaultDark = useMediaQuery('(prefers-color-scheme: dark)');
    const switchTheme = () => { setState(s => { return { ...s, theme : switch_theme(s.theme, defaultDark) }}) }
    return { settingState, setters : { switchTheme } };
  },
  v => v.settingState.theme,
  v => v.settingState.app_name,
  v => v.settingState.endpoint,
  v => v.settingState.contract,
  v => v.settingState.network,
  v => v.settingState.ipfs_browser,
  v => v.settingState.git_repo,
  v => v.settingState.help,
  v => v.setters.switchTheme
);
