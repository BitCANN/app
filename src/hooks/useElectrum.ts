import { ElectrumNetworkProvider } from 'cashscript';
// import { useWallet } from './useWallet';
import { ElectrumClient } from '@electrum-cash/network';
import { UTXO } from '../types';

export const useElectrum = () => {
  // const { signTransaction } = useWallet();
  let client: any = null;

  const getClient = async (serverUrl?: string) => {
    if (client) return client;

    const ec = new ElectrumClient(
      'BitCANN',
      '1.5.3',
      serverUrl || 'electrum.imaginary.cash'
    );

    client = new ElectrumNetworkProvider('mainnet', { electrum: ec })

    return client;
  }


  const fetchUTXOs = async (address: string): Promise<UTXO[] | any> => {
    if(!address) return [];
    const client = await getClient();
    const utxos = await client.getUtxos(address);
    console.log('unspent outputs', utxos);

    return utxos;
  };

  return {
    fetchUTXOs,
    getClient
  };
};