import { keccak256 } from '../hash';
import { hash } from 'eth-crypto';

describe('keccak256 function tests', () => {
  const message = '0x8ba1f109551bd432803012645ac136ddd64dba72';
  const expectedHashPattern = /^0x[0-9a-fA-F]{64}$/; // hex string of 64 characters

  const expected = '0xd59d38b46c2e385e712dced79b33e8e7e5e931138f17435596f1bfee9914f99e';

  it('should correctly hash a string with local hash function', () => {
    const result = keccak256(message);
    expect(result).toMatch(expectedHashPattern);
    expect(result).toEqual(expected);
  });

  it('should correctly hash a string with eth-crypto hash function', async () => {
    const result = hash.keccak256(message);
    expect(result).toMatch(expectedHashPattern);
    expect(result).toEqual(expected);
  });
});
