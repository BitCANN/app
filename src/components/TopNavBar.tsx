import React, { useEffect } from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { useElectrum } from '../hooks/useElectrum';
import { useWalletConnect } from '../hooks/useWalletConnect';
import { ConnectButton } from './ConnectButton';
import { themeConstants } from '../theme/constants';
import { electrumServers } from '../config';

const TopNavBar = () => {
  const { getElectrumClient } = useElectrum();
  const { 
    address, 
    isInitializing, 
    connect, 
    disconnect,
  } = useWalletConnect();

  console.log('isInitializing', isInitializing)
  const [selectedServer, setSelectedServer] = React.useState(electrumServers[0].url);

  useEffect(() => {
    // Initialize with the default server URL
    getElectrumClient(electrumServers[0].url);
  }, []);

  const handleServerChange = async (event: any) => {
    const newServer = event.target.value;
    setSelectedServer(newServer);
    console.log('newServer', newServer)
    await getElectrumClient(newServer);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(31, 34, 44, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Box>
        <Button
          href="/"
          sx={{
            color: '#B6509E',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
              color: '#2EBAC6',
            },
          }}
        >
          BitCANN
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ minWidth: 250 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="server-select-label" sx={{ color: 'white' }}>Electrum Server</InputLabel>
            <Select
              labelId="server-select-label"
              value={selectedServer}
              label="Electrum Server"
              onChange={handleServerChange}
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                },
              }}
            >
              {electrumServers.map((server) => (
                <MenuItem key={server.url} value={server.url}>
                  {server.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {address ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Typography
                sx={{
                  color: themeConstants.colors.text.secondary,
                  fontSize: '0.75rem',
                  fontFamily: themeConstants.typography.fontFamily
                }}
              >
                Connected Address
              </Typography>
              <Typography
                sx={{
                  color: themeConstants.colors.text.primary,
                  fontSize: '0.75rem',
                  fontFamily: themeConstants.typography.fontFamily,
                  background: 'rgba(21, 126, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: themeConstants.borderRadius.small,
                  border: '1px solid rgba(21, 126, 255, 0.2)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {address}
              </Typography>
            </Box>
            <ConnectButton
              onClick={disconnect}
              sx={{ minWidth: 'auto', padding: '6px 12px' }}
            >
              Disconnect
            </ConnectButton>
          </Box>
        ) : (
          <ConnectButton 
            onClick={connect}
            disabled={isInitializing}
            sx={{ minWidth: 'auto', padding: '6px 12px' }}
          >
            {isInitializing ? "Initializing..." : "Connect Wallet"}
          </ConnectButton>
        )}
      </Box>
    </Box>
  );
};

export default TopNavBar; 