import { recoverPublicKey } from '../recoverPublicKey';
import { recoverPublicKey as recoverPublicKeyEthCrypto } from 'eth-crypto';

const DATA = [
  {
    message: 'random secret string',
    pair: {
      privateKey: '0x66f12873d3a6255a36b5ab7cb061b4b2b20d089168367ac364ff05a174211ce9',
      publicKey:
        '96ad3f1cffb44bf29e8fe5daad5282dac2b4c106efcf7dd7d1d21fa43a37a78df54d3a475cd6b21304ebac808722c97a8dbff9feb3066b865b8682a819ab9a49',
      address: '0x44727a44a39249a86bb73B9480A40e312bDefc59',
    },
    messageHash: '0x0191001736e81f1f8067533c2708c806eba9092a73a26dda2c5108b2e2781ea5',
    signature:
      '0x82eb8d112397201d3de10d6dee3f5513f697c00424b6b00cb770de1e2bf933646e4de7748365996b8a039aec36eabdc8b4e4b25b785ee4777d50bdedc8f278ae1c',
  },
  {
    message: 'random secret string',
    pair: {
      privateKey: '0x3980cfeea16a573fddae342ee591bdccfb15906aec062518caa0978111ecfa0a',
      publicKey:
        'cd1f6b9bc885ae4fc5262528ab8b768c993e1a493b114cea7522fb99b9b30be71134e69782718e07487a828e46693c9762913542fde82e662506341266652ba0',
      address: '0x82F6eCa9097A9DDA7e25A1F462bAa771b3e52d32',
    },
    messageHash: '0x0191001736e81f1f8067533c2708c806eba9092a73a26dda2c5108b2e2781ea5',
    signature:
      '0xcbd864de729a9e32645daae050a11799fa7dfc61547858d3f645fed33e82f3281fcbe6c9133e01eab43c6c9ecd7f99adb11de6a24f1fef732d8bccfbd4b751431b',
  },
];

describe('recoverPublicKey function', () => {
  test.each(DATA)(
    'should recover the correct public key for a given signature and hash using both local and eth-crypto methods an get same result',
    async (data) => {
      const publicKey = recoverPublicKey(data.signature, data.messageHash);
      expect(publicKey).toBe(data.pair.publicKey);
      const ethCryptoPublicKey = recoverPublicKeyEthCrypto(data.signature, data.messageHash);
      expect(ethCryptoPublicKey).toBe(data.pair.publicKey);
    },
  );
});
