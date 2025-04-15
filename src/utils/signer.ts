import { SignatureTemplate, Utxo } from 'cashscript';
import { reverseClaimCommitment, toTokenAddress } from './helpers';
import { cashAddressToLockingBytecode, decodeTransaction } from '@bitauth/libauth';
import { hexToBin } from '@bitauth/libauth';


interface ElectrumTokenData {
  amount: string;
  category: string;
  nft?: {
    capability: string;
    commitment: string;
  }
}

interface ElectrumUTXO {
  tx_hash: string;
  tx_pos: number;
  height: number;
  value: number;
  token_data?: ElectrumTokenData;
}


// export interface Utxo {
//   txid: string;
//   vout: number;
//   satoshis: bigint;
//   token?: TokenDetails;
// }

// export interface TokenDetails {
//   amount: bigint;
//   category: string;
//   nft?: {
//       capability: 'none' | 'mutable' | 'minting';
//       commitment: string;
//   };
// }

const ownerPkh = 'b50bbbabc937c8cb7a54375f0f5d73f8a6a0628f';
const bTokenCategoryNonReversed = '71d29d5239b908fe6996d97680fd2fb9a69596806b25f22ddd223ca58f4767f5'
const claimTokenCategoryNonReversed = '8b5e273114a5002d914d68cd8ff90b0f38afc3827ca2a7ffa91fce26432f4c3d'

let bTokenCategory = '';
let claimTokenCategory = '';


const setCategories = (bTokenCategoryNonReversed, claimTokenCategoryNonReversed) => {
  bTokenCategory = bTokenCategoryNonReversed
    .match(/.{2}/g) // Split into byte pairs
    .reverse()      // Reverse the byte pairs
    .join('');

  claimTokenCategory = claimTokenCategoryNonReversed
    .match(/.{2}/g) // Split into byte pairs
    .reverse()      // Reverse the byte pairs
    .join('');
}

setCategories(bTokenCategoryNonReversed, claimTokenCategoryNonReversed);


export const claimTransaction = async (contract, userAddress, bReserveTokenUTXO, userClaimNFTUTXO, fundTransactionUTXO) => {

  console.log(bReserveTokenUTXO, userClaimNFTUTXO, fundTransactionUTXO)

  console.log('contract.tokenAddress', contract.tokenAddress)

  const { amount } = reverseClaimCommitment(userClaimNFTUTXO.token_data.nft.commitment)
  const amountToClaim = amount

  console.log('bReserveTokenUTXO.token_data.amount', bReserveTokenUTXO.token_data.amount)

  console.log('amountToClaim', amountToClaim)

  const amountBackToReserve = BigInt(bReserveTokenUTXO.token_data.amount) - amountToClaim

  console.log('amountBackToReserve', amountBackToReserve)

  const totalChangeAmount = BigInt(fundTransactionUTXO.value) - BigInt(800) - BigInt(550)

  const bUTXO: Utxo = {
    txid: bReserveTokenUTXO.tx_hash,
    vout: bReserveTokenUTXO.tx_pos,
    satoshis: BigInt(bReserveTokenUTXO.value),
    token: {
      amount: BigInt(bReserveTokenUTXO.token_data.amount),
      category: bReserveTokenUTXO.token_data.category
    }
  }

  const claimNFTUTXO: Utxo = {
    txid: userClaimNFTUTXO.tx_hash,
    vout: userClaimNFTUTXO.tx_pos,
    satoshis: BigInt(userClaimNFTUTXO.value),
    token: userClaimNFTUTXO.token_data
  }

  const fundUTXO: Utxo = {
    txid: fundTransactionUTXO.tx_hash,
    vout: fundTransactionUTXO.tx_pos,
    satoshis: BigInt(fundTransactionUTXO.value),
  }

  const transaction = await contract.functions.claim()
  .from([bUTXO])
  // .fromP2PKH(userClaimNFTUTXO, new SignatureTemplate(userWallet.privateKeyWif, HashType.SIGHASH_ALL | HashType.SIGHASH_UTXOS))
  // .fromP2PKH(fundTransactionUTXO, new SignatureTemplate(userWallet.privateKeyWif, HashType.SIGHASH_ALL | HashType.SIGHASH_UTXOS))
  .fromP2PKH(claimNFTUTXO, new SignatureTemplate(Uint8Array.from(Array(32))))
  .fromP2PKH(fundUTXO, new SignatureTemplate(Uint8Array.from(Array(32))))
  .to([
    {
      to: contract.tokenAddress,
      amount: BigInt(Number(bReserveTokenUTXO.value)),
      token: {
        amount: amountBackToReserve,
        category: bReserveTokenUTXO.token_data.category
      }
    },
    {
      to: toTokenAddress(userAddress),
      amount: BigInt(Number(800)),
      token: {
        amount: BigInt(Number(amountToClaim)),
        category: bReserveTokenUTXO.token_data.category
      }
    },
    {
      to: userAddress,
      amount: totalChangeAmount,
    }
  ])
  .withoutTokenChange()
  .withAge(0)

  console.log(transaction)


  const rawTransactionHex = await transaction.build();
  console.log('rawTransactionHex', rawTransactionHex)
  const decodedTransaction: any = decodeTransaction(hexToBin(rawTransactionHex));
  if (typeof decodedTransaction === "string") {
    alert("Failed to decode transaction");
  }

  console.log(decodedTransaction)


  decodedTransaction.inputs[1].unlockingBytecode = Uint8Array.from([]);
  decodedTransaction.inputs[2].unlockingBytecode = Uint8Array.from([]);

  // construct new transaction object for SourceOutputs, for stringify & not to mutate current network provider 
  const listSourceOutputs = [{
    ...decodedTransaction.inputs[0],
    // @ts-ignore
    lockingBytecode: (cashAddressToLockingBytecode(contract.tokenAddress)).bytecode,
    valueSatoshis: BigInt(bUTXO.satoshis),
    token: bUTXO.token && {
      ...bUTXO.token,
      category: hexToBin(bUTXO.token.category),
    },
    contract: {
      abiFunction: transaction.abiFunction,
      redeemScript: contract.redeemScript,
      artifact: contract.artifact,
    }
  }, {
    ...decodedTransaction.inputs[1],
    // @ts-ignore
    lockingBytecode: (cashAddressToLockingBytecode(userAddress)).bytecode,
    valueSatoshis: BigInt(claimNFTUTXO.satoshis),
    token: claimNFTUTXO.token && {
      ...claimNFTUTXO.token,
      category: hexToBin(claimNFTUTXO.token.category),
      nft: claimNFTUTXO.token.nft && {
        ...claimNFTUTXO.token.nft,
        commitment: hexToBin(claimNFTUTXO.token.nft.commitment),
      },
    },
  }, {
    ...decodedTransaction.inputs[2],
    // @ts-ignore
    lockingBytecode: (cashAddressToLockingBytecode(userAddress)).bytecode,
    valueSatoshis: BigInt(fundUTXO.satoshis),
  }];

  const wcTransactionObj = {
    transaction: decodedTransaction,
    sourceOutputs: listSourceOutputs,
    broadcast: true,
    userPrompt: "Claim Token"
  };

  console.log(wcTransactionObj)

  return wcTransactionObj;
}