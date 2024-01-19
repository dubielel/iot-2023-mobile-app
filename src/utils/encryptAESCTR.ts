import { ModeOfOperation, utils } from 'aes-js';

export const encryptAESCTR = (toEncode: string, key: number[]): Uint8Array => {
  const encryptor = new ModeOfOperation.ModeOfOperationCTR(key);
  const toEncodeBytes = utils.utf8.toBytes(toEncode);
  return encryptor.encrypt(toEncodeBytes);
};
