import { hexToBytes } from 'ethereum-cryptography/utils';

/**
 * Returns a `Boolean` on whether or not the a `String` starts with '0x'
 * @param str the string input value
 * @return a boolean if it is or is not hex prefixed
 * @throws if the str input is not a string
 */
export const isHexPrefixed = (str: string) => {
  if (typeof str !== 'string') {
    throw new Error(`[isHexPrefixed] input must be type 'string', received type ${typeof str}`);
  }

  return str[0] === '0' && str[1] === 'x';
};

/**
 * Removes '0x' from a given `String` if present
 * @param str the string value
 * @returns the string without 0x prefix
 */
export const stripHexPrefix = (str: string): string => {
  if (typeof str !== 'string') throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);

  return isHexPrefixed(str) ? str.slice(2) : str;
};

/**
 * Is the string a hex string.
 *
 * @param  value
 * @param  length
 * @returns  output the string is a hex string
 */
export const isHexString = (value: string, length?: number): boolean => {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) return false;

  if (length && value.length !== 2 + 2 * length) return false;

  return true;
};

/**
 * Adds '0x' to a given `String` if not present
 * @param str the string input value
 * @return the string with a 0x prefix
 */

export const addLeading0x = (str: string) => {
  if (!str.startsWith('0x')) return '0x' + str;
  else return str;
};

export const decompress = (startsWith02Or03: string) => {
  const testByteArray = hexToBytes(startsWith02Or03);
  let startsWith04 = startsWith02Or03;
  if (testByteArray.length === 64) {
    startsWith04 = '04' + startsWith02Or03;
  }
  return startsWith04.substring(2);
};

/** Helper function to concat UInt8Arrays mimicking the behaviour of the
 *  Buffer.concat function in Node.js
 */

export const concatUint8Arrays = (uint8arrays: Uint8Array[]) => {
  const totalLength = uint8arrays.reduce((total, uint8array) => total + uint8array.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  uint8arrays.forEach((uint8array) => {
    result.set(uint8array, offset);
    offset += uint8array.byteLength;
  });
  return result;
};

/**
 * Converts a UTF-8 string to a Uint8Array without using TextEncoder, which is not available in mobile
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
export const utf8ToBytes = (str: string): Uint8Array => {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  const bytes = [];

  for (let i = 0; i < str.length; i++) {
    const codePoint = str.codePointAt(i);

    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0x10000) {
      bytes.push(0xe0 | (codePoint >> 12), 0x80 | ((codePoint >> 6) & 0x3f), 0x80 | (codePoint & 0x3f));
    } else {
      i++; // skip one iteration since we have a surrogate pair
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    }
  }
  return new Uint8Array(bytes);
};
