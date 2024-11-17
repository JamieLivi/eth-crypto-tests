import { stripHexPrefix } from './util';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex } from 'ethereum-cryptography/utils';
import { decompress } from './decompress';

/**
 * Generate publicKey from the privateKey.
 * This creates the uncompressed publicKey,
 * where 04 has stripped from left
 * @returns {string}
 */

export const publicKeyByPrivateKey = (privateKey: string) => {
  const key = stripHexPrefix(privateKey);
  const publicKey = secp256k1.getPublicKey(key, false);
  const hex = bytesToHex(publicKey);
  return decompress(hex);
};
