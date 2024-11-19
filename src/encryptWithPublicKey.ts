import { decompress } from './util';
import { encrypt } from './encryption-utils';
import { EncryptionOptions } from './types';

export const encryptWithPublicKey = (publicKey: string, message: string, options?: EncryptionOptions) => {
  // ensure its an uncompressed publicKey
  const decompressedKey = decompress(publicKey);

  // re-add the compression-flag
  const pubString = '04' + decompressedKey;
  return encrypt(pubString, message, options);
};
