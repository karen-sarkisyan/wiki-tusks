import { Tusky } from '@tusky-io/ts-sdk/web';
import type { Vault } from '@tusky-io/ts-sdk/web';
import { UploadResponse } from '../types';

export class TuskyService {
  private static instance?: TuskyService;
  private tuskyClient?: Tusky;
  private vault?: Vault;
  private initPromise?: Promise<void>;
  private isInitialized = false;

  private constructor() {
    this.initializeClient();
  }

  /**
   * Get the singleton instance of TuskyService
   */
  public static getInstance(): TuskyService {
    if (!TuskyService.instance) {
      TuskyService.instance = new TuskyService();
    }
    return TuskyService.instance;
  }

  private async initializeClient() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInitialize();
    return this.initPromise;
  }

  private async doInitialize() {
    try {
      console.log('Initializing Tusky client');
      this.tuskyClient = new Tusky({
        apiKey: import.meta.env.VITE_TUSKY_API_KEY || '',
      });
      this.vault = await this.tuskyClient.vault.get(
        'a136077a-523f-4dd6-93bc-bd58413fb144'
      );
      this.isInitialized = true;
      console.log('Tusky client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Tusky client:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeClient();
    }
    if (!this.tuskyClient || !this.vault) {
      throw new Error('Tusky service not properly initialized');
    }
  }

  /**
   * Check if the service is ready to use
   */
  public async waitForInitialization(): Promise<void> {
    await this.ensureInitialized();
  }

  /**
   * Check if the service is currently initialized
   */
  public get isReady(): boolean {
    return this.isInitialized && !!this.tuskyClient && !!this.vault;
  }

  /**
   * Upload a file to Tusky using the official SDK
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      await this.ensureInitialized();

      const fileData = await file.arrayBuffer();
      const fileBlob = new Blob([fileData], { type: file.type });
      const fileUploadId = await this.tuskyClient!.file.upload(
        this.vault!.id,
        fileBlob,
        {
          name: file.name,
        }
      );

      return {
        success: true,
        blobId: fileUploadId,
        message: 'File uploaded successfully to Tusky using SDK',
        transactionDigest: fileUploadId,
      };
    } catch (error) {
      console.error('Tusky upload error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * List all files in the vault
   */
  async listFiles(): Promise<Array<{ id: string; name: string }>> {
    try {
      await this.ensureInitialized();

      const files = await this.tuskyClient!.file.listAll({
        vaultId: this.vault!.id,
        status: 'active',
      });
      return files.map((file) => ({
        id: file.id,
        name: file.name || 'untitled',
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Read file content by upload ID
   */
  async readFileContent(uploadId: string): Promise<string | null> {
    try {
      await this.ensureInitialized();

      const arrayBuffer = await this.tuskyClient!.file.arrayBuffer(uploadId);
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(arrayBuffer);
    } catch (error) {
      console.error('Error reading file content:', error);
      return null;
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
