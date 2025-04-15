import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export const LoadingOverlay = ({ open, message }: LoadingOverlayProps) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Box textAlign="center">
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
    </Backdrop>
  );
}; 