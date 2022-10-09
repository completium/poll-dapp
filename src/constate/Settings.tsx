import { NetworkType } from "@airgap/beacon-sdk";
import { useState } from 'react';

import constate from "constate";

export enum Theme {
  Light,
  Dark
}

const switch_theme = (t : Theme) : Theme => {
  switch (t) {
    case Theme.Light : return Theme.Dark
    case Theme.Dark  : return Theme.Light
  }
}

export const [
  SettingsProvider,
  useTheme,
  useAppName,
  useEndpoint,
  usePollAddress,
  useNetwork,
  useIPFSBrowser,
  useGitRepo,
  useSettingsSetters,
] = constate(
  () => {
    const [settingState, setState] = useState({
      app_name        : 'Poll DAPP',
      endpoint        : 'https://kathmandunet.ecadinfra.com',
      poll_contract   : 'KT1V88jY1kfgmHzErgY36xX3qwJNGUxsZqzq',
      ipfs_browser    : 'https://api.ipfsbrowser.com/ipfs/get.php?hash=',
      network         :  NetworkType.KATHMANDUNET,
      theme           :  Theme.Dark,
      git_repo        : 'https://github.com/completium/first-dapp/tree/main/src'
    });
    const switchTheme = () => { setState(s => { return { ...s, theme : switch_theme(s.theme) }}) }
    return { settingState, setters : { switchTheme } };
  },
  v => v.settingState.theme,
  v => v.settingState.app_name,
  v => v.settingState.endpoint,
  v => v.settingState.poll_contract,
  v => v.settingState.network,
  v => v.settingState.ipfs_browser,
  v => v.settingState.git_repo,
  v => v.setters
);
