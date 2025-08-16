export interface UploadResponse {
  success: boolean;
  blobId?: string;
  error?: string;
  message?: string;
  transactionDigest?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}
