import { ModeOfOperation, padding, utils } from 'aes-js';

const ivLength = 16;

export const decryptAESCBC = (toDecode: string, key: number[]): string => {
  const binaryString = atob(toDecode);
  const ivBytes = new Uint8Array(ivLength);
  const encryptedBytes = new Uint8Array(binaryString.length - ivLength);

  let i = 0;
  while (i < ivLength) {
    ivBytes[i] = binaryString.charCodeAt(i);
    i++;
  }
  while (i < binaryString.length) {
    encryptedBytes[i - ivLength] = binaryString.charCodeAt(i);
    i++;
  }

  const decryptor = new ModeOfOperation.cbc(key, ivBytes);

  const decrypted = decryptor.decrypt(encryptedBytes);
  return utils.utf8.fromBytes(padding.pkcs7.strip(decrypted));
};
