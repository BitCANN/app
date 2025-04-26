import { ElectrumNetworkProvider } from 'cashscript';
import { ElectrumClient } from '@electrum-cash/network';
import { UTXO } from '../types';
import { useState } from 'react';

export const useElectrum = () => {
  // const { signTransaction } = useWallet();
  const [electrumClient, setElectrumClient] = useState<ElectrumNetworkProvider | null>(null);

  const getElectrumClient = async (serverUrl?: string) => {
    if (electrumClient && !serverUrl) return electrumClient;

    // if(electrumClient) {
    //   await electrumClient.disconnect();
    // }

    console.log('serverUrl', serverUrl);

    const ec = new ElectrumClient(
      'BitCANN',
      // '1.5.3',
      '1.4.1',
      serverUrl
    );

    const newClient = new ElectrumNetworkProvider('mainnet', { electrum: ec });
    setElectrumClient(newClient);
    return newClient;
  }


  const fetchUTXOs = async (address: string): Promise<UTXO[] | any> => {
    if (!address) return [];
    const currentClient = electrumClient || await getElectrumClient();
    const utxos = await currentClient.getUtxos(address);
    console.log('unspent outputs', utxos);

    return utxos;
  };

  return {
    fetchUTXOs,
    getElectrumClient,
    electrumClient
  };
};