import { isHexPrefixed, stripHexPrefix, isHexString, addLeading0x, utf8ToBytes } from '../util';
import { bytesToHex, utf8ToBytes as utf8ToBytesEc } from 'ethereum-cryptography/utils';
import * as bip39 from 'ethereum-cryptography/bip39/index.js';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english.js';

describe('util functions', () => {
  describe('isHexPrefixed', () => {
    it('should return true for strings starting with 0x', () => {
      expect(isHexPrefixed('0x123')).toBe(true);
    });

    it('should return false for strings not starting with 0x', () => {
      expect(isHexPrefixed('123')).toBe(false);
    });

    it('should throw an error for non-string inputs', () => {
      // @ts-expect-error testing incorrect type
      expect(() => isHexPrefixed(123)).toThrow("[isHexPrefixed] input must be type 'string', received type number");
    });
  });

  describe('stripHexPrefix', () => {
    it('should remove 0x from a string if present', () => {
      expect(stripHexPrefix('0x123')).toBe('123');
    });

    it('should return the original string if 0x is not present', () => {
      expect(stripHexPrefix('123')).toBe('123');
    });

    it('should throw an error for non-string inputs', () => {
      // @ts-expect-error testing incorrect type
      expect(() => stripHexPrefix(123)).toThrow("[stripHexPrefix] input must be type 'string', received number");
    });
  });

  describe('isHexString', () => {
    it('should return true for valid hex strings', () => {
      expect(isHexString('0x123')).toBe(true);
    });

    it('should return false for strings without 0x prefix', () => {
      expect(isHexString('123')).toBe(false);
    });

    it('should return false for strings with invalid characters', () => {
      expect(isHexString('0xGHI')).toBe(false);
    });

    it('should return false for non-string inputs', () => {
      // @ts-expect-error testing incorrect type
      expect(isHexString(123)).toBe(false);
    });

    it('should respect length parameter if provided', () => {
      expect(isHexString('0x123456', 3)).toBe(true); // 6 hex digits = 3 bytes
      expect(isHexString('0x123456', 2)).toBe(false); // Length mismatch
    });
  });

  describe('addLeading0x', () => {
    it('should add 0x to a string if not present', () => {
      expect(addLeading0x('123')).toBe('0x123');
    });

    it('should not add 0x to a string if already present', () => {
      expect(addLeading0x('0x123')).toBe('0x123');
    });
  });
});

const testArray = Array.from({ length: 30 }, () => {
  return bip39.generateMnemonic(wordlist);
});

test.each(testArray)(
  'should test to see if the local utf8ToBytes function returns same result as utf8ToBytes from ethereum-cryptography for phrase %s',
  () => {
    const seed = bip39.generateMnemonic(wordlist, 256);
    const bytes = utf8ToBytes(seed);
    const ecBytes = utf8ToBytesEc(seed);
    expect(bytes).toEqual(ecBytes);
    const hex = bytesToHex(bytes);
    const ecHex = bytesToHex(ecBytes);
    expect(hex).toEqual(ecHex);
  },
);
