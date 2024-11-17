import { stripHexPrefix } from './util';
import { decrypt } from './encryption-utils';
import { Encrypted } from './types';

export const decryptWithPrivateKey = (privateKey: string, encrypted: Encrypted) => {
  // remove '0x' from privateKey
  const twoStripped = stripHexPrefix(privateKey);

  return decrypt(twoStripped, encrypted);
};
