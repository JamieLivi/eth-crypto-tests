import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { createIdentity, createPrivateKey, DEFAULT_ENTROPY_BYTES } from '../createIdentity';
import { createIdentity as createIdentityEthCrypto } from 'eth-crypto';

describe('createPrivateKey tests', () => {
  it('should create a private key without entropy', () => {
    const privateKey = createPrivateKey();
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(privateKey.length).toBe(66);
  });

  it('should throw an error if entropy is not a Uint8Array', () => {
    // @ts-expect-error testing invalid input
    expect(() => createPrivateKey('invalid entropy')).toThrow(
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
    const ethCryptoIdentity = createIdentityEthCrypto();
    expect(ethCryptoIdentity).toHaveProperty('privateKey');
    expect(ethCryptoIdentity).toHaveProperty('publicKey');
  });

  it('should return a valid hex string with correct length for private key', () => {
    const privateKey = createPrivateKey();
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    // Length of keccak256 hash in hex plus '0x' prefix
    expect(privateKey.length).toBe(66);

    const ethCryptoPrivateKey = createIdentityEthCrypto().privateKey;
    expect(ethCryptoPrivateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(ethCryptoPrivateKey.length).toBe(66);
  });

  it('should return different public keys for different private keys', () => {
    const identity1 = createIdentity();
    const identity2 = createIdentity();
    expect(identity1.publicKey).not.toBe(identity2.publicKey);
    const identity3 = createIdentityEthCrypto();
    const identity4 = createIdentityEthCrypto();
    expect(identity3.publicKey).not.toBe(identity4.publicKey);
  });

  it('privateKey and publicKey should have valid lengths', async () => {
    const identity = createIdentity();
    const ethCryptoIdentity = createIdentityEthCrypto();

    const publicKeyLength = identity.publicKey.length;
    // Assuming specific lengths for privateKey and publicKey based on common standards
    expect(publicKeyLength).toBe(128); // Length of keccak256 hash in hex plus '0x' prefix
    expect(ethCryptoIdentity.publicKey.length).toBe(publicKeyLength);

    const privateKeyLength = identity.privateKey.length;
    expect(privateKeyLength).toBe(66);
    // Length of keccak256 hash in hex plus '0x' prefix
    expect(ethCryptoIdentity.privateKey.length).toBe(privateKeyLength);
  });

  it('should return public keys of equal length using local function and eth-crypto function', () => {
    const identity = createIdentity();
    const ethCryptoIdentity = createIdentityEthCrypto();
    expect(identity.publicKey.length).toBe(ethCryptoIdentity.publicKey.length);
    expect(identity.publicKey.length).toBe(128);
  });

  it('should return private keys of equal length using local function and eth-crypto function', () => {
    const identity = createIdentity();
    const ethCryptoIdentity = createIdentityEthCrypto();
    expect(identity.privateKey.length).toBe(ethCryptoIdentity.privateKey.length);
    expect(identity.privateKey.length).toBe(66);
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

  it('should create the same private key from valid entropy for both local and eth-crypto functions', () => {
    const validEntropy = new Uint8Array(128);
    const privateKey = createPrivateKey(validEntropy);
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(privateKey.length).toBe(66);

    const ethCryptoPrivateKey = createIdentityEthCrypto(Buffer.from(validEntropy)).privateKey;
    expect(ethCryptoPrivateKey).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(ethCryptoPrivateKey.length).toBe(66);

    expect(privateKey).toBe(ethCryptoPrivateKey);
  });

  it('should create the sane identity from a random valid entropy for both local and eth-crypto functions', () => {
    const validEntropy = getRandomBytesSync(128);
    const identity = createIdentity(validEntropy);
    const ethCryptoIdentity = createIdentityEthCrypto(Buffer.from(validEntropy));
    expect(identity.publicKey).toBe(ethCryptoIdentity.publicKey);
    expect(identity.privateKey).toBe(ethCryptoIdentity.privateKey);
  });
});
