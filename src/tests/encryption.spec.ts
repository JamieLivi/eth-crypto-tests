import { encryptWithPublicKey } from '../encryptWithPublicKey';
import { decryptWithPrivateKey } from '../decryptWithPrivateKey';

const TEST_DATA = [
  {
    privateKey: '0x107be946709e41b7895eea9f2dacf998a0a9124acbb786f0fd1a826101581a07',
    publicKey:
      'bf1cc3154424dc22191941d9f4f50b063a2b663a2337e5548abea633c1d06eceacf2b81dd326d278cd992d5e03b0df140f2df389ac9a1c2415a220a4a9e8c046',
    message: 'Three wickets in his last over, four fours from his next',
  },
  {
    privateKey: '0x66f12873d3a6255a36b5ab7cb061b4b2b20d089168367ac364ff05a174211ce9',
    publicKey:
      '96ad3f1cffb44bf29e8fe5daad5282dac2b4c106efcf7dd7d1d21fa43a37a78df54d3a475cd6b21304ebac808722c97a8dbff9feb3066b865b8682a819ab9a49',
    message: 'Lifted over extra cover to move to 16 from seven deliveries',
  },
  {
    privateKey: '0x3980cfeea16a573fddae342ee591bdccfb15906aec062518caa0978111ecfa0a',
    publicKey:
      'cd1f6b9bc885ae4fc5262528ab8b768c993e1a493b114cea7522fb99b9b30be71134e69782718e07487a828e46693c9762913542fde82e662506341266652ba0',
    message: 'Alzarri Joseph plays a lovely classical drive through the covers for four',
  },
];

describe('NEW FUNCTIONS - Encryption and decryption tests', () => {
  test.each(TEST_DATA)(
    'should encrypt with public key then decrypt with private key and get same message',
    async (data) => {
      const encrypted = await encryptWithPublicKey(data.publicKey, data.message);
      console.log('🚀 ~ encrypted:', encrypted);
      const decrypted = await decryptWithPrivateKey(data.privateKey, encrypted);
      expect(decrypted).toBe(data.message);
    },
  );
});
