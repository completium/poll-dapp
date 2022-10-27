import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { IconButton } from '@mui/material';

import { useHelpUrl } from '../contexts/Settings';

export const HelpLink = () => {
  const url = useHelpUrl()
  return <IconButton sx={{ ml: 'auto', color : 'white' }} onClick={() => window.open(url, "_blank")}><HelpCenterIcon /></IconButton>
}