import { sign } from '../sign';

const PRIVATE_KEY = '0xb966663733f9dacb81ccf336508bb334cca74136f6063783f737fb4c12c96c63';
const HASH = '0x2a6cbba5f734a92891f3548343db1ad63a5aa63b14d17b8af526d5f978f8770e';

const OUTPUT =
  '0xa222db3e921f6c3f9fc5f11a75868b1b50343885e38f5b2644a7dd49b6566c4c61903c65e439bc19cf6f079687785f60a5e17185af7420674265c7c95e21a2401b';

describe('sign function', () => {
  it('should return correct output for correct input', () => {
    const signature = sign(PRIVATE_KEY, HASH);
    expect(signature).toEqual(OUTPUT);
  });

  it('should throw an error for invalid private key', () => {
    const invalidHash = 'invalid';
    expect(() => sign(invalidHash, HASH)).toThrow();
  });
});
