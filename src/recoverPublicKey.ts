import { ecdsaRecover } from 'secp256k1';
import { uint8ArrayToHex } from './utils/uint8ArrayToHex';
import { removeLeading0x } from './utils/removeLeading0x';
import { hexToUnit8Array } from './utils/hexToUnit8Array';

export function recoverPublicKey(signature: string, hash: string): string {
  signature = removeLeading0x(signature);

  // split into v-value and sig
  const sigOnly = signature.substring(0, signature.length - 2); // all but last 2 chars
  const vValue = signature.slice(-2); // last 2 chars

  const recoveryNumber = vValue === '1c' ? 1 : 0;

  let pubKey = uint8ArrayToHex(
    ecdsaRecover(hexToUnit8Array(sigOnly), recoveryNumber, hexToUnit8Array(removeLeading0x(hash)), false),
  );

  // remove trailing '04'
  pubKey = pubKey.slice(2);

  return pubKey;
}
