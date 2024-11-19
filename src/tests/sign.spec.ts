import { sign, hmacSha256Sign } from '../sign';
import { sign as ethCryptoSign } from 'eth-crypto';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';

const PRIVATE_KEY = '0xb966663733f9dacb81ccf336508bb334cca74136f6063783f737fb4c12c96c63';
const HASH = '0x2a6cbba5f734a92891f3548343db1ad63a5aa63b14d17b8af526d5f978f8770e';

const OUTPUT =
  '0xa222db3e921f6c3f9fc5f11a75868b1b50343885e38f5b2644a7dd49b6566c4c61903c65e439bc19cf6f079687785f60a5e17185af7420674265c7c95e21a2401b';

describe('sign function', () => {
  it('should return correct output for correct input using both local and eth-crypto functions', () => {
    const signature = sign(PRIVATE_KEY, HASH);
    expect(signature).toEqual(OUTPUT);
    const ethCryptoSignature = ethCryptoSign(PRIVATE_KEY, HASH);
    expect(ethCryptoSignature).toEqual(OUTPUT);
  });

  it('should throw an error for invalid private key', () => {
    const invalidPrivateKey = 'invalid';
    expect(() => sign(invalidPrivateKey, HASH)).toThrow();
  });

  it('should throw an error for invalid hash', () => {
    const invalidHash = 'invalid';
    expect(() => sign(PRIVATE_KEY, invalidHash)).toThrow();
  });

  it('should throw an error for hash with incorrect length', () => {
    const shortHash = '0x1234';
    expect(() => sign(PRIVATE_KEY, shortHash)).toThrow();
  });
});

describe('hmacSha256Sign function tests', () => {
  const keyString = 'Wallaby';
  const message = 'Unicorns exist at Republic';

  const encodedKey = new TextEncoder().encode(keyString);
  const encodedMessage = new TextEncoder().encode(message);
  const expectedHmac = hexToBytes('e91efbc3396cd94f6f4e202ffbbc040a09271cde0115b8013a8a9325879dc5f3');

  it('should convert key back to string correctly', () => {
    const keyHex = bytesToHex(encodedKey);
    const decoded = new TextDecoder().decode(hexToBytes(keyHex));
    expect(decoded).toBe(keyString);
  });
  it('should return correct HMAC for given key and message', () => {
    const result = hmacSha256Sign(encodedKey, encodedMessage);
    expect(result).toEqual(expectedHmac);
  });

  it('should throw an error for invalid key type', () => {
    // @ts-expect-error testing invalid input
    expect(() => hmacSha256Sign(123, new TextEncoder().encode(message))).toThrow();
  });
});
