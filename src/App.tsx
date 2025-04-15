import React, { useState } from 'react';
import { Container, Grid, Box } from '@mui/material';
import { Wallet } from './components/Wallet';


export const App = () => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const onAddressUpdate = (address: string) => {
    setConnectedAddress(address);
  };


  return (
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Box
          sx={{
            borderRadius: '14px',
            background: 'rgba(71, 73, 77, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '0.1px solid rgba(255, 255, 255, 0.05)',
            p: { xs: 2, md: 4 },
            mb: 4,
          }}
        >
          <Wallet onAddressUpdate={onAddressUpdate} />
        </Box>
        
      </Container>
  );
};

export default App;
