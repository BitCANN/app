import { Button } from '@mui/material';
import { themeConstants } from '../theme/constants';

interface ConnectButtonProps {
  onClick?: () => Promise<any>;
  children?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const ConnectButton = ({ onClick, children = 'Connect with WalletConnect', fullWidth = true, disabled }: ConnectButtonProps) => {
  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        background: themeConstants.colors.primary.gradient,
        color: '#FFFFFF', 
        textTransform: 'none',
        borderRadius: themeConstants.borderRadius.medium,
        padding: '10px',
        fontFamily: themeConstants.typography.fontFamily,
        fontWeight: 500,
        '&:hover': {
          background: themeConstants.colors.primary.gradientHover,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      {children}
    </Button>
  );
};