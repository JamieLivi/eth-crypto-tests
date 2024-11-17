import { sha512 } from 'ethereum-cryptography/sha512.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { getRandomBytesSync as randomBytes } from 'ethereum-cryptography/random.js';
import { hexToBytes, bytesToHex, utf8ToBytes, bytesToUtf8 } from 'ethereum-cryptography/utils.js';
import { encrypt as aesEncrypt, decrypt as aesDecrypt } from 'ethereum-cryptography/aes.js';
import { Encrypted } from './types';
import { hmacSha256Sign } from './sign';
import { concatUint8Arrays } from './util';

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
  const message = utf8ToBytes(msg);
  const data = aesEncrypt(message, encryptionKey, iv, 'aes-256-cbc');
  const dataToMac = concatUint8Arrays([iv, ephemPublicKey, data]);
  const mac = hmacSha256Sign(macKey, dataToMac);
  return {
    iv: iv,
    ephemPublicKey: ephemPublicKey,
    ciphertext: bytesToHex(data),
    mac: mac,
  };
};

export const decrypt = (privateKey: string, opts: Encrypted) => {
  const sharedSecret = secp256k1.getSharedSecret(hexToBytes(privateKey), opts.ephemPublicKey, true).slice(1);
  const hash = sha512(sharedSecret);
  const encryptionKey = hash.subarray(0, 32);
  const ciphertext = hexToBytes(opts.ciphertext);
  const iv = hexToBytes(opts.iv);
  const decrypted = aesDecrypt(ciphertext, encryptionKey, iv, 'aes-256-cbc');
  return bytesToUtf8(decrypted);
};
