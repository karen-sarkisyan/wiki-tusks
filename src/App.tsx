import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { UploadResult } from './components/UploadResult';
import { WalletProvider, ConnectButton } from './components/WalletProvider';
import { UploadResponse } from './types';
import styles from './App.module.css';

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
      <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerNav}>
            <div className={styles.logo}>
              <div>
                <svg
                  className={styles.logoIcon}
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
              <div className={styles.logoText}>
                <h1 className={styles.logoTitle}>
                  Walrus Uploader
                </h1>
                <p className={styles.logoSubtitle}>
                  Decentralized storage for the web
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Upload Your Markdown Files
          </h2>
          <p className={styles.heroDescription}>
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
        <div className={styles.info}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>
              About Walrus Storage
            </h3>
            <div className={styles.infoGrid}>
              <div>
                <h4 className={styles.sectionTitle}>
                  How it works
                </h4>
                <ul className={styles.sectionList}>
                  <li className={styles.sectionListItem}>• Files are split into chunks and distributed across the network</li>
                  <li className={styles.sectionListItem}>• Advanced erasure coding ensures data reliability</li>
                  <li className={styles.sectionListItem}>• Storage costs are approximately 5x the file size</li>
                  <li className={styles.sectionListItem}>• Files are publicly accessible and discoverable</li>
                </ul>
              </div>
              <div>
                <h4 className={styles.sectionTitle}>
                  Benefits
                </h4>
                <ul className={styles.sectionList}>
                  <li className={styles.sectionListItem}>• Decentralized and censorship-resistant</li>
                  <li className={styles.sectionListItem}>• Cost-effective storage for large files</li>
                  <li className={styles.sectionListItem}>• Built-in redundancy and reliability</li>
                  <li className={styles.sectionListItem}>• No single point of failure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>
            Built with ❤️ for the decentralized web. Powered by{' '}
            <a
              href="https://walrus.space"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Walrus
            </a>
            .
          </p>
        </div>
      </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
