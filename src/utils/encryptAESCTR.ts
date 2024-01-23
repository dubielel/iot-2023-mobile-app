import { ModeOfOperation, utils, padding } from 'aes-js';

export const encryptAESCTR = (toEncode: string, key: number[]): string => {
  const iv = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    iv[i] = Math.floor(Math.random() * 256);
  }

  const encryptor = new ModeOfOperation.cbc(key, iv);

  const toEncodeBytes = padding.pkcs7.pad(utils.utf8.toBytes(toEncode));
  const encryptedBytes = encryptor.encrypt(toEncodeBytes);

  return btoa(String.fromCodePoint(...iv, ...encryptedBytes));
};
