export interface Encrypted {
  iv: string;
  ephemPublicKey: string;
  mac: string;
  ciphertext: string;
}

export type EncryptionOptions = {
  iv?: string;
  ephemPrivateKey?: string;
};
