import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';
import { useGitRepo } from '../constate/Settings';

export const GitHubLink = () => {
  const repo = useGitRepo()
  return <IconButton href={repo}><GitHubIcon /></IconButton>
}