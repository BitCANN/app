import React, { useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { themeConstants } from '../theme/constants';
import { useWallet } from '../hooks/useWallet';
import { ConnectButton } from './ConnectButton';
import { useElectrum } from '../hooks/useElectrum';
import { WalletProps } from '../types'; 

export const Wallet: React.FC<WalletProps> = ({ onAddressUpdate }) => {
  const { 
    address, 
    isInitializing, 
    connect, 
    disconnect,
    signTransaction
  } = useWallet();

  const { fetchUTXOs } = useElectrum();

  useEffect(() => {
    onAddressUpdate(address);
    console.log('address:', address);
    const getUTXOs = async () => {
      const utxos = await fetchUTXOs(address);
      console.log('utxos:', utxos);
    };
    getUTXOs();
  }, [address]);

  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: themeConstants.colors.text.primary,
          fontSize: '1.1rem',
          fontFamily: themeConstants.typography.fontFamily,
          mb: 1
        }}
      >
        Bitcoin Cash Wallet
      </Typography>

      {address ? (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography
              sx={{
                color: themeConstants.colors.text.secondary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily
              }}
            >
              Network
            </Typography>
            <Typography
              sx={{
                color: themeConstants.colors.text.primary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily,
                background: 'rgba(21, 126, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: themeConstants.borderRadius.small,
                border: '1px solid rgba(21, 126, 255, 0.2)',
              }}
            >
              Bitcoin Cash
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography
              sx={{
                color: themeConstants.colors.text.secondary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily
              }}
            >
              Connected Address
            </Typography>
            <Typography
              sx={{
                color: themeConstants.colors.text.primary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily,
                background: 'rgba(21, 126, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: themeConstants.borderRadius.small,
                border: '1px solid rgba(21, 126, 255, 0.2)',
                wordBreak: 'break-all'
              }}
            >
              {address}
            </Typography>
          </Box>
          
          <ConnectButton
            onClick={disconnect}
          >
            Disconnect BCH Wallet
          </ConnectButton>
        </Box>
      ) : (
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              color: themeConstants.colors.text.secondary,
              fontFamily: themeConstants.typography.fontFamily
            }}
          >
            Connect your Bitcoin Cash wallet using WalletConnect
          </Typography>
          <ConnectButton 
            onClick={connect}
            disabled={isInitializing}
            fullWidth
          >
            {isInitializing 
              ? "Initializing..."
              : "Connect to BCH Network"}
          </ConnectButton>

          
        </Box>
      )}
    </Stack>
  );
}; 