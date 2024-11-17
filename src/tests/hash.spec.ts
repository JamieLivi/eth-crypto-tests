import { keccak256 } from '../hash';

describe('keccak256 function', () => {
  const message = '0x8ba1f109551bd432803012645ac136ddd64dba72';
  const expected = '0xd59d38b46c2e385e712dced79b33e8e7e5e931138f17435596f1bfee9914f99e';

  it('should correctly hash a single string', () => {
    const expectedHashPattern = /^0x[0-9a-fA-F]{64}$/; // Assuming keccak256 returns a hex string of 64 characters
    const result = keccak256(message);
    expect(result).toMatch(expectedHashPattern);
    expect(result).toEqual(expected);
  });
});
