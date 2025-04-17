export interface WalletState {
  address: string;
  error: string;
  loading: boolean;
} 

export interface WalletProps {
  onAddressUpdate: (address: string) => void;
}

export interface UTXO {
  txid: string;
  vout: number;
  value: number;
  height: number;
  confirmations: number;
  scriptPubKey: string; 
}