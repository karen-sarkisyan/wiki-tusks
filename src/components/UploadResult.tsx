import React from 'react';
import { UploadResponse } from '../types';

interface UploadResultProps {
  result: UploadResponse;
  onReset: () => void;
}

export const UploadResult: React.FC<UploadResultProps> = ({ result, onReset }) => {
  if (!result.success) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-green-400"
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
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">
              Upload Successful!
            </h3>
            <p className="text-sm text-green-700 mt-1">
              {result.message}
            </p>
          </div>
        </div>

        {result.blobId && (
          <div className="mt-4">
            <div className="bg-white rounded-md p-4 border border-green-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                File Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blob ID:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                    {result.blobId}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm text-green-600 font-medium">
                    Stored on Walrus
                  </span>
                </div>
                {result.transactionDigest && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono max-w-[200px] truncate">
                      {result.transactionDigest}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your file is now stored on the decentralized Walrus network</li>
                <li>• The file is publicly accessible using the Blob ID</li>
                <li>• Storage costs are approximately 5x the file size</li>
                <li>• The file will be available as long as the network maintains it</li>
              </ul>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                ⚠️ Important Notes
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• All files stored in Walrus are public and discoverable</li>
                <li>• Do not upload sensitive or private information</li>
                <li>• Consider encrypting content before upload if privacy is needed</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex space-x-3">
          <button
            onClick={onReset}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Upload Another File
          </button>
          {result.blobId && (
            <button
              onClick={() => navigator.clipboard.writeText(result.blobId!)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Copy Blob ID
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
