import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';

import { useGitRepo } from '../contexts/Settings';

export const GitHubLink = () => {
  const repo = useGitRepo()
  return <IconButton onClick={() => window.open(repo, "_blank")} sx={{ color : 'white' }}><GitHubIcon /></IconButton>
}