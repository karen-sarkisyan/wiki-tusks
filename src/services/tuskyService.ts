import { Tusky } from "@tusky-io/ts-sdk/web";
import type { Vault } from "@tusky-io/ts-sdk/web";
import { UploadResponse } from '../types';

export class TuskyService {
  private tuskyClient?: Tusky;
  private vault?: Vault;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    console.log("Initializing Tusky client");
    this.tuskyClient = new Tusky({
      apiKey: import.meta.env.VITE_TUSKY_API_KEY || ''
    });
    this.vault = await this.tuskyClient.vault.get("a136077a-523f-4dd6-93bc-bd58413fb144");
  }

  /**
   * Upload a file to Tusky using the official SDK
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      if (!this.tuskyClient) {
        console.log("TUSKY NOT INITIALIZED");
        await this.initializeClient();
      }
      
      if (!this.vault) {
        throw new Error('Vault not initialized');
      }

      const fileData = await file.arrayBuffer();
      const fileBlob = new Blob([fileData], { type: file.type });
      const fileUploadId = await this.tuskyClient?.file.upload(this.vault.id, fileBlob, {
        name: file.name,
      });
      
      return {
        success: true,
        blobId: fileUploadId,
        message: 'File uploaded successfully to Tusky using SDK',
        transactionDigest: fileUploadId
      };
    } catch (error) {
      console.error('Tusky upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Read a file from Tusky by blob ID
   */
  async readFile(_blobId: string): Promise<Uint8Array | null> {
    // TODO: Implement file reading from Tusky
    throw new Error('Method not implemented');
  }
}
