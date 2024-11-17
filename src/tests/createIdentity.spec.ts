import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { createIdentity, createPrivateKey, DEFAULT_ENTROPY_BYTES } from '../createIdentity';

describe('createPrivateKey tests', () => {
  it('should create a private key without entropy', () => {
    const privateKey = createPrivateKey();
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(privateKey.length).toBe(66);
  });

  it('should throw an error if entropy is not a Uint8Array', () => {
    expect(() => createPrivateKey('invalid entropy' as any)).toThrow(
      `entropy must be a Uint8Array of at least ${DEFAULT_ENTROPY_BYTES} bytes`,
    );
  });

  it('should throw an error if entropy length is less than DEFAULT_ENTROPY_BYTES', () => {
    const shortEntropy = new Uint8Array(DEFAULT_ENTROPY_BYTES - 1);
    expect(() => createPrivateKey(shortEntropy)).toThrow(
      `entropy must be a Uint8Array of at least ${DEFAULT_ENTROPY_BYTES} bytes`,
    );
  });

  it('should create a private key from valid entropy', () => {
    const validEntropy = getRandomBytesSync(DEFAULT_ENTROPY_BYTES);
    const privateKey = createPrivateKey(validEntropy);
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(privateKey.length).toBe(66);
  });
});

describe('createIdentity tests', () => {
  it('should return an object with privateKey and publicKey', async () => {
    const identity = createIdentity();
    expect(identity).toHaveProperty('privateKey');
    expect(identity).toHaveProperty('publicKey');
  });

  it('should return a valid hex string with correct length', () => {
    const privateKey = createPrivateKey();
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    // Length of keccak256 hash in hex plus '0x' prefix
    expect(privateKey.length).toBe(66);
  });

  it('privateKey and publicKey should have valid lengths', async () => {
    const identity = createIdentity();
    // Assuming specific lengths for privateKey and publicKey based on common standards
    expect(identity.privateKey.length).toBe(66); // Length of keccak256 hash in hex plus '0x' prefix
    // This length check for publicKey might need adjustment based on actual expected length
    expect(identity.publicKey.length).toBeGreaterThanOrEqual(64); // Minimum length check for publicKey
  });

  it('should throw an error if entropy is not a Uint8Array', () => {
    expect(() => createPrivateKey(new Uint8Array([0]))).toThrow(
      `entropy must be a Uint8Array of at least ${DEFAULT_ENTROPY_BYTES} bytes`,
    );
  });

  it('should throw an error if entropy length is less than DEFAULT_ENTROPY_BYTES', () => {
    const shortEntropy = new Uint8Array(DEFAULT_ENTROPY_BYTES - 1);
    expect(() => createPrivateKey(shortEntropy)).toThrow(
      `entropy must be a Uint8Array of at least ${DEFAULT_ENTROPY_BYTES} bytes`,
    );
  });

  it('should create a private key from valid entropy', () => {
    const validEntropy = new Uint8Array(DEFAULT_ENTROPY_BYTES);
    const privateKey = createPrivateKey(validEntropy);

    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(privateKey.length).toBe(66);
  });

  it('should create an identity from valid entropy', () => {
    const validEntropy = getRandomBytesSync(DEFAULT_ENTROPY_BYTES);
    const identity = createIdentity(validEntropy);

    expect(identity).toHaveProperty('privateKey');
    expect(identity).toHaveProperty('publicKey');

    expect(identity.privateKey.length).toBe(66);
    expect(identity.publicKey.length).toBeGreaterThanOrEqual(64);
  });
});
