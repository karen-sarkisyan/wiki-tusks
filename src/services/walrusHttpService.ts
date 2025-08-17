import { UploadResponse, UploadProgress } from '../types';

interface WalrusPublisherResponse {
  newlyCreated?: {
    blobObject: {
      id: string;
      blobId: string;
      size: number;
      registeredEpoch: number;
      certifiedEpoch: number;
      storage: {
        startEpoch: number;
        endEpoch: number;
      };
      deletable: boolean;
    };
    cost: number;
  };
  alreadyCertified?: {
    blobId: string;
    event: {
      txDigest: string;
      eventSeq: string;
    };
    endEpoch: number;
  };
}

export class WalrusHttpService {
  // Using Mysten Labs' testnet publisher
  private readonly PUBLISHER_URL =
    'https://publisher.walrus-testnet.walrus.space';
  private readonly AGGREGATOR_URL =
    'https://aggregator.walrus-testnet.walrus.space';

  /**
   * Upload a file using Walrus HTTP API (no wallet required)
   */
  async uploadFile(
    file: File,
    epochs: number = 1,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // File validation - accepting all files as markdown content

      const url = `${this.PUBLISHER_URL}/v1/blobs?epochs=${epochs}`;

      if (onProgress) {
        onProgress({ loaded: 0, total: file.size, percentage: 0 });
      }

      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'text/markdown',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: WalrusPublisherResponse = await response.json();

      if (onProgress) {
        onProgress({ loaded: file.size, total: file.size, percentage: 100 });
      }

      // Handle both newly created and already certified responses
      if (result.newlyCreated) {
        return {
          success: true,
          blobId: result.newlyCreated.blobObject.blobId,
          message: 'File uploaded successfully to Walrus via HTTP API',
          transactionDigest: result.newlyCreated.blobObject.id,
        };
      } else if (result.alreadyCertified) {
        return {
          success: true,
          blobId: result.alreadyCertified.blobId,
          message: 'File already exists on Walrus',
          transactionDigest: result.alreadyCertified.event.txDigest,
        };
      } else {
        throw new Error('Unexpected response format from Walrus publisher');
      }
    } catch (error) {
      console.error('Walrus HTTP upload error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Read a file from Walrus using HTTP API
   */
  async readFile(blobId: string): Promise<Uint8Array | null> {
    try {
      const url = `${this.AGGREGATOR_URL}/v1/blobs/${blobId}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Blob ${blobId} not found`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Error reading file from Walrus:', error);
      return null;
    }
  }

  /**
   * Check if a blob exists on Walrus
   */
  async blobExists(blobId: string): Promise<boolean> {
    try {
      const url = `${this.AGGREGATOR_URL}/v1/blobs/${blobId}`;
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking blob existence:', error);
      return false;
    }
  }
}
