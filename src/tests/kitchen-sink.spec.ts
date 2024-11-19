import {
  publicKeyByPrivateKey as ethCryptoPublicKeyByPrivateKey,
  hash,
  sign as ethCryptoSign,
  encryptWithPublicKey as ethCryptoEncryptWithPublicKey,
  decryptWithPrivateKey as ethCryptoDecryptWithPrivateKey,
} from 'eth-crypto';
import { createIdentity } from '../createIdentity';
import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { bytesToHex } from 'ethereum-cryptography/utils';
import { keccak256 } from '../hash';
import { sign } from '../sign';
import { encryptWithPublicKey } from '../encryptWithPublicKey';
import { decryptWithPrivateKey } from '../decryptWithPrivateKey';
import * as bip39 from 'ethereum-cryptography/bip39/index.js';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english.js';

const ethCryptokeccak256 = hash.keccak256;

const testArray = Array.from({ length: 20 }, (_, i) => i + 1);

test.each(testArray)(
  'should test all cryptographic functions for equivalence with eth-crypto using unique values #%i',
  async () => {
    const { publicKey, privateKey } = createIdentity();
    const ethCryptoPublicKey = ethCryptoPublicKeyByPrivateKey(privateKey);
    expect(publicKey).toEqual(ethCryptoPublicKey);

    const signatureMessage = bytesToHex(getRandomBytesSync(20));
    const hashedMessage = keccak256(signatureMessage);
    const ethCryptoHashed = ethCryptokeccak256(signatureMessage);
    expect(hashedMessage).toEqual(ethCryptoHashed);

    const signature = sign(privateKey, hashedMessage);
    const ethCryptoSignature = ethCryptoSign(privateKey, hashedMessage);
    expect(signature).toEqual(ethCryptoSignature);

    const seed = bip39.generateMnemonic(wordlist, 256);
    const encryptedSeed = encryptWithPublicKey(publicKey, seed);
    const ethCryptoEncryptedSeed = await ethCryptoEncryptWithPublicKey(publicKey, seed);

    const ethCryptoDecryptedSeed1 = await ethCryptoDecryptWithPrivateKey(privateKey, encryptedSeed);
    expect(ethCryptoDecryptedSeed1).toEqual(decryptWithPrivateKey(privateKey, encryptedSeed));
    expect(ethCryptoDecryptedSeed1).toEqual(decryptWithPrivateKey(privateKey, ethCryptoEncryptedSeed));
    expect(ethCryptoDecryptedSeed1).toEqual(seed);

    const ethCryptoDecryptedSeed2 = await ethCryptoDecryptWithPrivateKey(privateKey, ethCryptoEncryptedSeed);
    expect(ethCryptoDecryptedSeed2).toEqual(decryptWithPrivateKey(privateKey, ethCryptoEncryptedSeed));
    expect(ethCryptoDecryptedSeed2).toEqual(decryptWithPrivateKey(privateKey, encryptedSeed));
    expect(ethCryptoDecryptedSeed2).toEqual(seed);
  },
);
