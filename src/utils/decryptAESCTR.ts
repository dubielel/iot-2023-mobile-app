import { ModeOfOperation, utils } from 'aes-js';

export const decryptAESCTR = (toDecode: string, key: number[]): string => {
  const encryptor = new ModeOfOperation.ModeOfOperationCTR(key);
  const toDecodeBytes = utils.utf8.toBytes(toDecode);
  const decrypted = encryptor.decrypt(toDecodeBytes);
  return utils.utf8.fromBytes(decrypted);
};
