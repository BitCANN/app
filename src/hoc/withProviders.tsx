import React from 'react';
import { ThemeProvider } from '@mui/material';
import { NotificationProvider } from '../contexts/NotificationContext';
import { theme } from '../theme';

export const withProviders = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithProvidersComponent(props: P) {
    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <WrappedComponent {...props} />
        </NotificationProvider>
      </ThemeProvider>
    );
  };
}; 