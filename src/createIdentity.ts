import { getRandomBytesSync as randomBytes } from 'ethereum-cryptography/random.js';
import { addLeading0x, stripHexPrefix, concatUint8Arrays } from './util';
import { publicKeyByPrivateKey } from './publicKeyByPrivateKey';
import { bytesToHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

export const DEFAULT_ENTROPY_BYTES = 32;

/**
 * creates a new private key
 * @param { Uint8Array } entropy - optional entropy to create the private key
 * @returns a new private key
 */
export const createPrivateKey = (entropy?: Uint8Array) => {
  if (entropy) {
    if (!(entropy instanceof Uint8Array) || entropy.length < DEFAULT_ENTROPY_BYTES) {
      throw new Error(`entropy must be a Uint8Array of at least ${DEFAULT_ENTROPY_BYTES} bytes`);
    }
    const outerHex = keccak256(entropy);
    return addLeading0x(bytesToHex(outerHex));
  } else {
    const innerHex = keccak256(concatUint8Arrays([randomBytes(32), randomBytes(32)]));
    const middleHex = concatUint8Arrays([concatUint8Arrays([randomBytes(32), innerHex]), randomBytes(32)]);
    const outerHex = keccak256(middleHex);
    return addLeading0x(bytesToHex(outerHex));
  }
};

/**
 * creates a new identity
 * @param { Uint8Array } entropy - optional entropy to create the private key
 * @returns a new pair of private and public key
 */
export const createIdentity = (entropy?: Uint8Array) => {
  const privateKey = createPrivateKey(entropy);

  const walletPublicKey = publicKeyByPrivateKey(privateKey);
  const identity = {
    privateKey: privateKey,
    publicKey: stripHexPrefix(walletPublicKey),
  };
  return identity;
};
