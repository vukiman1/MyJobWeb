import { styled } from '@mui/material/styles';
import { Paper, List, Box } from '@mui/material';

export const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

export const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: -30,
  background: theme.palette.primary.main,
  color: 'white',
  padding: '4px 30px',
  transform: 'rotate(45deg)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

export const FeatureList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const JobPostCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
