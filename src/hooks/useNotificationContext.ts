import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return a dummy implementation instead of throwing
    return {
      showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        console.warn('NotificationContext not found, logging instead:', { message, type });
      },
      hideNotification: () => {
        console.warn('NotificationContext not found');
      }
    };
  }
  return context;
};

export const useNotificationHandlers = () => {
  const { showNotification } = useNotificationContext();

  return {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showInfo: (message: string) => showNotification(message, 'info'),
    showWarning: (message: string) => showNotification(message, 'warning'),
  };
}; 