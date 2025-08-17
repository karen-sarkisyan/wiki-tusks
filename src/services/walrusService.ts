import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { WalrusClient, WalrusFile } from '@mysten/walrus';
import { UploadResponse, UploadProgress } from '../types';

export class WalrusService {
  private walrusClient: any;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const suiClient = new SuiClient({
      url: getFullnodeUrl('testnet'),
    });
    this.walrusClient = new WalrusClient({
      network: 'testnet',
      suiClient,
    });
  }

  /**
   * Upload a file to Walrus using the official SDK
   */
  async uploadFile(
    file: File,
    signer: any,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // File validation - accepting all files as markdown content

      if (!signer) {
        throw new Error(
          'Wallet connection required. Please connect your wallet first.'
        );
      }

      // Convert file to Uint8Array
      const fileBuffer = await file.arrayBuffer();
      const fileContent = new Uint8Array(fileBuffer);

      // Create WalrusFile from content
      const walrusFile = WalrusFile.from({
        contents: fileContent,
        identifier: file.name,
        tags: {
          'content-type': file.type || 'text/markdown',
          'original-name': file.name,
          'file-size': file.size.toString(),
        },
      });

      // Simulate progress updates since SDK doesn't provide built-in progress tracking
      if (onProgress) {
        onProgress({ loaded: 0, total: file.size, percentage: 0 });

        // Update progress during upload
        const progressInterval = setInterval(() => {
          const randomProgress = Math.min(90, Math.random() * 80 + 10);
          onProgress({
            loaded: Math.floor((randomProgress / 100) * file.size),
            total: file.size,
            percentage: Math.floor(randomProgress),
          });
        }, 500);

        try {
          // Upload to Walrus
          const results = await this.walrusClient.writeFiles({
            files: [walrusFile],
            epochs: 3, // Store for 3 epochs
            deletable: true,
            signer: signer,
          });

          clearInterval(progressInterval);

          // Complete progress
          onProgress({ loaded: file.size, total: file.size, percentage: 100 });

          if (results && results.length > 0) {
            const result = results[0];
            return {
              success: true,
              blobId: result.blobId || result.id,
              message: 'File uploaded successfully to Walrus using SDK',
              transactionDigest: result.transactionDigest,
            };
          } else {
            throw new Error('No results returned from Walrus upload');
          }
        } catch (uploadError) {
          clearInterval(progressInterval);
          throw uploadError;
        }
      } else {
        // Upload without progress tracking
        const results = await this.walrusClient.writeFiles({
          files: [walrusFile],
          epochs: 3,
          deletable: true,
          signer: signer,
        });

        if (results && results.length > 0) {
          const result = results[0];
          return {
            success: true,
            blobId: result.blobId || result.id,
            message: 'File uploaded successfully to Walrus using SDK',
            transactionDigest: result.transactionDigest,
          };
        } else {
          throw new Error('No results returned from Walrus upload');
        }
      }
    } catch (error) {
      console.error('Walrus upload error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Read a file from Walrus by blob ID
   */
  async readFile(blobId: string): Promise<Uint8Array | null> {
    try {
      const data = await this.walrusClient.readFile(blobId);
      return data;
    } catch (error) {
      console.error('Error reading file from Walrus:', error);
      return null;
    }
  }
}
