import { sha512 } from 'ethereum-cryptography/sha512.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { hexToBytes, bytesToHex } from 'ethereum-cryptography/utils.js';
import { Encrypted } from './types';
import { concatUint8Arrays } from './concat-uint8-arrays';
import { hmacSha256Sign } from './sign';
import { aes256CbcEncrypt } from './aes-encrypt';
import { aes256CbcDecrypt } from './aes-decrypt';
import { getRandomBytesSync as randomBytes } from 'ethereum-cryptography/random.js';

/** See:
 *  https://github.com/bitchan/eccrypto
 *  https://cryptojs.gitbook.io/docs#custom-key-and-iv
 *
 */

export const encrypt = async (publicKeyTo: string, msg: string) => {
  const ephemPrivateKey = randomBytes(32);
  const iv = randomBytes(16);
  const ephemPublicKey = secp256k1.getPublicKey(ephemPrivateKey, false);
  const sharedSecret = secp256k1.getSharedSecret(ephemPrivateKey, hexToBytes(publicKeyTo), true).slice(1);
  const hash = sha512(sharedSecret);
  const encryptionKey = hash.subarray(0, 32);
  const macKey = hash.subarray(32);
  const ivHex = bytesToHex(iv);
  const data = aes256CbcEncrypt(ivHex, encryptionKey, msg);
  const dataToMac = concatUint8Arrays([iv, ephemPublicKey, hexToBytes(data)]);
  const mac = hmacSha256Sign(macKey, dataToMac);
  return {
    iv: iv,
    ephemPublicKey: ephemPublicKey,
    ciphertext: data,
    mac: mac,
  };
};

export const decrypt = (privateKey: string, opts: Encrypted) => {
  const sharedSecret = secp256k1.getSharedSecret(hexToBytes(privateKey), opts.ephemPublicKey, true).slice(1);
  const hash = sha512(sharedSecret);
  const encryptionKey = hash.subarray(0, 32);
  const decrypted = aes256CbcDecrypt(opts.iv, encryptionKey, opts.ciphertext);
  return decrypted;
};
