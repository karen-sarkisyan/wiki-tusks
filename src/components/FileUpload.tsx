import React, { useState, useRef } from 'react';
import { useFileUpload } from '../hooks/useFiles';
import { UploadResponse, FileInfo } from '../types';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onUploadComplete: (response: UploadResponse) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useFileUpload();

  const handleFileSelect = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      // We could set a local error state here, but for now we'll rely on mutation error
      return;
    }

    setSelectedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    
    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        // Transform the data to match expected UploadResponse format
        const response: UploadResponse = {
          success: true,
          blobId: data.blobId,
          message: data.message,
          transactionDigest: data.transactionDigest
        };
        onUploadComplete(response);
        
        // Reset form
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (error) => {
        console.error('Upload failed:', error);
        // Call onUploadComplete with error for backward compatibility
        onUploadComplete({
          success: false,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      {/* File Selection */}
      <div className={styles.section}>
        <label className={styles.label}>
          Select File
        </label>
        <div className={styles.fileSelectionArea}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            className={styles.hiddenInput}
          />
          
          {!selectedFile ? (
            <div className={styles.fileSelectionContent}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.fileSelectButton}
              >
                <svg
                  className={styles.uploadIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Choose File
              </button>
              <p className={styles.uploadHint}>
                Select any file up to 10MB
              </p>
            </div>
          ) : (
            <div className={styles.selectedFileInfo}>
              <div className={styles.fileDetails}>
                <svg
                  className={styles.fileIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{selectedFile.name}</p>
                  <p className={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.changeFileButton}
              >
                Change File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {uploadMutation.error && (
        <div className={styles.errorMessage}>
          <p className={styles.errorText}>
            {uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Upload failed'}
          </p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploadMutation.isPending && (
        <button
          onClick={handleUpload}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Upload to Tusky
        </button>
      )}

      {/* Uploading State */}
      {uploadMutation.isPending && (
        <button
          disabled
          className={`${styles.button} ${styles.buttonLoading}`}
        >
          Uploading...
        </button>
      )}
    </div>
  );
};
