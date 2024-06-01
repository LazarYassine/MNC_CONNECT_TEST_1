import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private readonly key = 'a1aab7f24e3499d25505497365edafd807e2838e319ec8d17cbb4a340b0b9d52';

  constructor() { }

  private encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.key).toString();
  }

  private decrypt(data: string): any {
    const bytes = CryptoJS.AES.decrypt(data, this.key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  private encryptKey(key: string): string {
    return CryptoJS.AES.encrypt(key, this.key).toString();
  }

  private decryptKey(encryptedKey: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private getEncryptedKey(key: string): string {
    const encryptedKey = this.encryptKey(key);
    return `encrypted_${encryptedKey}`;
  }

  setItem(key: string, value: any): void {
    try {
      const encryptedKey = this.getEncryptedKey(key);
      const encryptedValue = this.encrypt(value);
      localStorage.setItem(encryptedKey, encryptedValue);
    } catch (error) {
      console.error('Error encrypting and storing data:', error);
    }
  }

  getItem(key: string): any {
    try {
      const encryptedKey = this.getEncryptedKey(key);
      const encryptedValue = localStorage.getItem(encryptedKey);
      if (encryptedValue) {
        return this.decrypt(encryptedValue);
      }
    } catch (error) {
      console.error('Error decrypting and retrieving data:', error);
    }
    return null;
  }

  removeItem(key: string): void {
    try {
      const encryptedKey = this.getEncryptedKey(key);
      localStorage.removeItem(encryptedKey);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  clear(): void {
    localStorage.clear();
  }
}
