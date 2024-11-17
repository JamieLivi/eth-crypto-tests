import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils.js';
import { keccak256 as _keccak256 } from 'ethereum-cryptography/keccak.js';
import { addLeading0x } from './util';
import { utf8ToBytes } from '@noble/curves/abstract/utils';

function solidityPackedKeccak256(value: string) {
  const bytes = utf8ToBytes(value);
  const hex = addLeading0x(bytesToHex(bytes));
  const hash = _keccak256(hexToBytes(hex));
  return addLeading0x(bytesToHex(hash));
}

export const keccak256 = (params: string) => {
  return solidityPackedKeccak256(params);
};
