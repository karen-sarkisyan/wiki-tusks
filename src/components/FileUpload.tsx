import React, { useState, useRef, useCallback } from 'react';
import { WalrusService } from '../services/walrusService';
import { useWallet } from './WalletProvider';
import { UploadProgress, UploadResponse, FileInfo } from '../types';

interface FileUploadProps {
  onUploadComplete: (response: UploadResponse) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTestnet, setUseTestnet] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const walrusService = useRef(new WalrusService(useTestnet));
  const { currentAccount, signTransaction } = useWallet();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.md')) {
      setError('Please select a markdown (.md) file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
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

    // Check if wallet is connected
    if (!currentAccount) {
      setError('Please connect your wallet first to upload to Walrus');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(null);

    try {
      const file = fileInputRef.current.files[0];
      const response = await walrusService.current.uploadFile(
        file,
        signTransaction,
        (progress) => setUploadProgress(progress)
      );

      if (response.success) {
        onUploadComplete(response);
        // Reset form
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleNetworkChange = (useTestnet: boolean) => {
    setUseTestnet(useTestnet);
    walrusService.current.setNetwork(useTestnet);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Network Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Network
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="network"
              checked={useTestnet}
              onChange={() => handleNetworkChange(true)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Testnet</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="network"
              checked={!useTestnet}
              onChange={() => handleNetworkChange(false)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Mainnet</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Current network: {walrusService.current.getNetworkName()} | RPC: {walrusService.current.getRelayUrl()}
        </p>
      </div>

      {/* Wallet Connection Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wallet Status
        </label>
        <div className="flex items-center space-x-2">
          {currentAccount ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Not Connected - Please connect your wallet to upload files
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Walrus requires a wallet connection to sign transactions for file uploads
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`upload-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragOver ? 'dragover' : 'border-gray-300'
        } ${selectedFile ? 'border-green-300 bg-green-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {!selectedFile ? (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900">
                Drop your markdown file here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Only .md files up to 10MB are supported
              </p>
            </div>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Click to change file
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading...</span>
            <span>{uploadProgress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && (
        <button
          onClick={handleUpload}
          disabled={!currentAccount}
          className={`mt-6 w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${
            currentAccount 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
        >
          {currentAccount ? 'Upload to Walrus' : 'Connect Wallet to Upload'}
        </button>
      )}

      {/* Uploading State */}
      {isUploading && (
        <button
          disabled
          className="mt-6 w-full bg-gray-400 text-white py-3 px-4 rounded-md cursor-not-allowed"
        >
          Uploading...
        </button>
      )}
    </div>
  );
};
