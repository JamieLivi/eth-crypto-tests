import { decompress } from './util';
import { encrypt } from './encryption-utils';
import { bytesToHex } from 'ethereum-cryptography/utils';

export const encryptWithPublicKey = async (publicKey: string, message: string) => {
  // ensure its an uncompressed publicKey
  const decompressedKey = decompress(publicKey);

  // re-add the compression-flag
  const pubString = '04' + decompressedKey;

  const result = await encrypt(pubString, message);
  const encrypted = {
    iv: bytesToHex(result.iv),
    ephemPublicKey: bytesToHex(result.ephemPublicKey),
    ciphertext: result.ciphertext,
    mac: bytesToHex(result.mac),
  };
  return encrypted;
};
