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
            borderRadius: '24px',
            background: 'rgba(31, 34, 44, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            p: { xs: 2, md: 4 },
            mb: 4,
          }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: '16px',
                  background: 'rgba(38, 41, 51, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <Wallet onAddressUpdate={onAddressUpdate} />
              </Box>
            </Grid>
          </Grid>

        </Box>
        
      </Container>
  );
};

export default App;
