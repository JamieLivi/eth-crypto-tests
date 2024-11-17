import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha2';
import { hexToBytes } from 'ethereum-cryptography/utils';
import { addLeading0x, stripHexPrefix } from './util';

/**
 * signs the given message
 * @param  {string} privateKey
 * @param  {string} hash
 * @return {string} hexString
 */
export const sign = (privateKey: string, hash: string) => {
  const hashWith0x = addLeading0x(hash);
  if (hashWith0x.length !== 66) throw new Error('Can only sign hashes, given: ' + hash);

  const sigObj = secp256k1.sign(hexToBytes(stripHexPrefix(hash)), hexToBytes(stripHexPrefix(privateKey)));

  const recoveryId = sigObj.recovery === 1 ? '1c' : '1b';
  const newSignature = '0x' + sigObj.toCompactHex() + recoveryId;
  return newSignature;
};

export const hmacSha256Sign = (key: Uint8Array, msg: Uint8Array) => {
  const result = hmac(sha256, key, msg);
  return result;
};
