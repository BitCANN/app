import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  message: string;
  type: NotificationType;
  open: boolean;
}

interface NotificationContextValue {
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
}

const initialState: NotificationState = {
  message: '',
  type: 'info',
  open: false
};

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NotificationState>(initialState);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setState({
      message,
      type,
      open: true
    });
  }, []);

  const hideNotification = useCallback(() => {
    setState(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  const contextValue = React.useMemo(
    () => ({
      showNotification,
      hideNotification
    }),
    [showNotification, hideNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={state.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Helper hook for common notification patterns
export const useNotificationHandlers = () => {
  const { showNotification } = useNotification();

  return {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showInfo: (message: string) => showNotification(message, 'info'),
    showWarning: (message: string) => showNotification(message, 'warning'),
  };
}; 