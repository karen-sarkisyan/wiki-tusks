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

export interface Article {
  id: string; // This is the Walrus blob ID
  title: string;
  createdDate: string; // ISO 8601 date string
}

export interface ArticleDatabase {
  articles: Article[];
}

export interface JSONBinResponse<T> {
  record: T;
  metadata: {
    id: string;
    private: boolean;
    createdAt: string;
    collectionId?: string;
  };
}

export interface JSONBinError {
  message: string;
  success: boolean;
}
