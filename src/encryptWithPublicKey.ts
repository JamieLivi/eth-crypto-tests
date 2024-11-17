import { decompress } from './util';
import { encrypt } from './encryption-utils';

export const encryptWithPublicKey = (publicKey: string, message: string) => {
  // ensure its an uncompressed publicKey
  const decompressedKey = decompress(publicKey);

  // re-add the compression-flag
  const pubString = '04' + decompressedKey;

  return encrypt(pubString, message);
};
