import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import { stringify } from "@bitauth/libauth"
import { useState, useEffect } from 'react';

const projectId = 'bcf35dc8f8757c1b15883b9161a6c8bf';
const wcMetadataBCH = {
  name: 'BitCANN',
  description: 'BitCANN',
  url: 'https://bitcann.org/',
  icons: ['https://bitcann.org/images/logo.png']
};

const network = "mainnet";
const connectedChain = network == "mainnet" ? "bch:bitcoincash" : "bch:bchtest";

const namespaces = {
  bch: {
    chains: [connectedChain],
    methods: ['bch_getAddresses', 'bch_signTransaction', 'bch_signMessage'],
    events: ['addressesChanged'],
  },
};

export const useWalletBCH = () => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [lastSession, setSession] = useState(null);
  const [walletConnectModal, setWalletConnectModal] = useState<WalletConnectModal | null>(null);
  const [address, setAddress] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  const isSessionExpired = (session) => {
    // Assuming session has an 'expiry' property which is a timestamp
    const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    return session.expiry && session.expiry < currentTime;
  };

  // Setup WalletConnect client and event handlers on initial render
  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        setIsInitializing(true);
        const client = await SignClient.init({
          projectId: projectId,
          relayUrl: 'wss://relay.walletconnect.com',
          metadata: wcMetadataBCH
        });
        setSignClient(client);

        const modal = new WalletConnectModal({
          projectId: projectId,
          themeMode: 'dark',
          themeVariables: {
            '--wcm-background-color': '#20c997',
            '--wcm-accent-color': '#20c997',
          },
          explorerExcludedWalletIds: 'ALL',
        });
        setWalletConnectModal(modal);

        // Safely get the last session
        try {
          const sessions = client.session.getAll();
          if (sessions.length > 0) {
            const session = sessions[sessions.length - 1];
            if (!isSessionExpired(session)) {
              setSession(session);
            } else {
              console.log("Session is expired");
            }
          }
        } catch (sessionError) {
          console.log("No active sessions found");
        }

        // Add event listeners for session events
        client.on('session_delete', handleSessionDelete);
        client.on('session_expire', handleSessionExpire);
        // Add other event listeners as needed

      } catch (error) {
        console.log("Failed to initialize WalletConnect:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initWalletConnect();

    // Cleanup event listeners on unmount
    return () => {
      if (signClient) {
        signClient.off('session_delete', handleSessionDelete);
        signClient.off('session_expire', handleSessionExpire);
        signClient.core.relayer.events.removeAllListeners();
      }
    };
  }, []);

  const handleSessionDelete = (session) => {
    console.log("Session deleted:", session);
    setSession(null);
    setAddress('');
  };

  const handleSessionExpire = (session) => {
    console.log("Session expired:", session);
    setSession(null);
    setAddress('');
  };

  const connect = async () => {
    if (!signClient || !walletConnectModal) {
      console.log("SignClient or Modal not initialized");
      return;
    }

    try {
      // Remove the automatic disconnect code and just proceed with connection
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: namespaces,
        optionalNamespaces: namespaces
      });

      if (!uri) {
        console.log("No URI received for connection");
        return;
      }

      await walletConnectModal.openModal({
        uri,
        standaloneChains: [connectedChain]
      });

      const session = await approval();
      setSession(session);
    } catch (error) {
      console.log("Connection failed:", error?.message || "Unknown error");
    } finally {
      if (walletConnectModal) {
        walletConnectModal.closeModal();
      }
    }
  };

  const disconnect = async () => {
    if (!lastSession || !signClient) return;

    try {
      // Check if the session is expired before attempting to disconnect
      if (isSessionExpired(lastSession)) {
        console.log("Session is already expired");
        setSession(null);
        setAddress('');
        return;
      }

      await signClient.disconnect({
        topic: lastSession.topic,
        reason: { code: 6000, message: "User disconnected" }
      });
    } catch (error) {
      // Ignore any disconnect errors
      console.log("Disconnect message:", error?.message || "Failed");
    } finally {
      setSession(null);
      setAddress('');
    }
  };

  const signTransaction = async (options) => {
    try {
      console.log('signing transaction', options);
      console.log('lastSession', lastSession);
      const result = await signClient.request({
        chainId: connectedChain,
        topic: lastSession.topic,
        request: {
          method: "bch_signTransaction",
          params: JSON.parse(stringify(options)),
        },
      });

      console.log('signed transaction', result);
  
      return result;
    } catch (error) {
      console.log('error signing transaction', error);
      return undefined;
    }
  }

  const getUserAddress = async () => {
    if (!signClient || !lastSession) return;

    try {
      const result = await signClient.request({
        chainId: connectedChain,
        topic: lastSession.topic,
        request: {
          method: "bch_getAddresses",
          params: {},
        },
      });

      if (result?.[0]) {
        setAddress(result[0]);
      }
    } catch (error) {
      console.log("Failed to get address:", error?.message || "Unknown error");
      setAddress('');
    }
  };

  useEffect(() => {
    if (lastSession && signClient) {
      getUserAddress();
    } else {
      setAddress('');
    }
  }, [lastSession, signClient]);

  useEffect(() => {
    if (address !== '') {
      // onAddressChange(address);
    }
  }, [address]);

  return {
    address,
    isInitializing,
    isConnected: !!lastSession,
    connect,
    disconnect,
    signTransaction
  };
}; 