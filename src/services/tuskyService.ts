import { Tusky } from "@tusky-io/ts-sdk/web";
import type { Vault } from "@tusky-io/ts-sdk/web";
import { UploadResponse, UploadProgress } from '../types';

// Sui network endpoints
const SUI_NETWORKS = {
  testnet: 'https://fullnode.testnet.sui.io',
  mainnet: 'https://fullnode.mainnet.sui.io'
};

export class TuskyService {
  private tuskyClient?: Tusky;
  private vault?: Vault;
  private useTestnet: boolean;

  constructor(useTestnet: boolean = true) {
    this.useTestnet = useTestnet;
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
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      if (!this.tuskyClient) {
        await this.initializeClient();
      }
      
      if (!this.vault) {
        throw new Error('Vault not initialized');
      }

      // Simulate progress updates
      if (onProgress) {
        onProgress({ loaded: 0, total: file.size, percentage: 0 });
        
        // Update progress during upload
        const progressInterval = setInterval(() => {
          const randomProgress = Math.min(90, Math.random() * 80 + 10);
          onProgress({ 
            loaded: Math.floor((randomProgress / 100) * file.size), 
            total: file.size, 
            percentage: Math.floor(randomProgress) 
          });
        }, 500);

        try {
          const fileData = await file.arrayBuffer();
          const fileBlob = new Blob([fileData], { type: file.type });
          const fileUploadId = await this.tuskyClient?.file.upload(this.vault.id, fileBlob);
          
          clearInterval(progressInterval);
          
          // Complete progress
          onProgress({ loaded: file.size, total: file.size, percentage: 100 });

          return {
            success: true,
            blobId: fileUploadId,
            message: 'File uploaded successfully to Tusky using SDK',
            transactionDigest: fileUploadId
          };
        } catch (uploadError) {
          clearInterval(progressInterval);
          throw uploadError;
        }
      } else {
        // Upload without progress tracking
        const fileData = await file.arrayBuffer();
        const fileBuffer = Buffer.from(fileData);
        const fileBlob = new Blob([fileBuffer], { type: file.type });
        const fileUploadId = await this.tuskyClient?.file.upload(this.vault.id, fileBlob, {
          name: file.name,
        });
        
        return {
          success: true,
          blobId: fileUploadId,
          message: 'File uploaded successfully to Tusky using SDK',
          transactionDigest: fileUploadId
        };
      }
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

  /**
   * Get the current network name
   */
  getNetworkName(): string {
    return this.useTestnet ? 'Testnet' : 'Mainnet';
  }

  /**
   * Get the current Sui RPC URL
   */
  getRelayUrl(): string {
    return this.useTestnet ? SUI_NETWORKS.testnet : SUI_NETWORKS.mainnet;
  }

  /**
   * Switch between testnet and mainnet
   */
  setNetwork(useTestnet: boolean): void {
    this.useTestnet = useTestnet;
    this.initializeClient();
  }
}
