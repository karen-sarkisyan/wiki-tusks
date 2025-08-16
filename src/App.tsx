import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { UploadResult } from './components/UploadResult';
import { WalletProvider, ConnectButton } from './components/WalletProvider';
import { UploadResponse } from './types';

function App() {
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const handleUploadComplete = (response: UploadResponse) => {
    setUploadResult(response);
  };

  const handleReset = () => {
    setUploadResult(null);
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Walrus Uploader
                </h1>
                <p className="text-sm text-gray-500">
                  Decentralized storage for the web
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upload Your Markdown Files
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Store your markdown files on Walrus, a decentralized storage network that provides 
            cost-effective, reliable storage for the web. Files are stored using advanced erasure 
            coding for maximum efficiency.
          </p>
        </div>

        {/* Upload Flow */}
        {!uploadResult ? (
          <FileUpload onUploadComplete={handleUploadComplete} />
        ) : (
          <UploadResult result={uploadResult} onReset={handleReset} />
        )}

        {/* Information Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              About Walrus Storage
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  How it works
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Files are split into chunks and distributed across the network</li>
                  <li>• Advanced erasure coding ensures data reliability</li>
                  <li>• Storage costs are approximately 5x the file size</li>
                  <li>• Files are publicly accessible and discoverable</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Benefits
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Decentralized and censorship-resistant</li>
                  <li>• Cost-effective storage for large files</li>
                  <li>• Built-in redundancy and reliability</li>
                  <li>• No single point of failure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Built with ❤️ for the decentralized web. Powered by{' '}
              <a
                href="https://walrus.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Walrus
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
