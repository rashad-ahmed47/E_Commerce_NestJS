import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import CryptoJS from 'crypto-js';

@Injectable()
export class SecurityService {
  encryption({ data, secretKey }: { data: string; secretKey?: string }) {
    if (!data) return '';
    secretKey = process.env.ENC_KEY as string;
    const cipherText = CryptoJS.AES.encrypt(data, secretKey).toString();
    return cipherText;
  }

  decryption({
    cipherText,
    secretKey,
  }: {
    cipherText: string;
    secretKey?: string;
  }) {
    if (!cipherText) return '';
    secretKey ??= process.env.ENC_KEY!;
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  async createHash({ data, salt = 8 }: { data: string; salt?: number }) {
    if (!data) return '';
    const cipherText = await hash(data, salt);
    return cipherText;
  }

  async compare({ cipher, text }: { cipher: string; text: string }) {
    if (!cipher || !text) return false;
    return compare(text, cipher);
  }
}
