import { useState, useRef } from 'react';
import { FileList } from './components/FileList';
import { MarkdownEditor } from './components/MarkdownEditor';
import { TuskyService } from './services/tuskyService';
// import { WalletProvider, ConnectButton } from './components/WalletProvider';
import styles from './App.module.css';

function App() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isNewFile, setIsNewFile] = useState(false);
  
  const tuskyService = useRef<TuskyService | null>(null);

  if (!tuskyService.current) {
    tuskyService.current = TuskyService.getInstance();
  }

  const handleFileSelect = (fileId: string, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
    setIsNewFile(false);
  };

  const handleAddArticle = () => {
    setSelectedFileId(null);
    setSelectedFileName(null);
    setIsNewFile(true);
  };

  const handleSave = (fileName: string) => {
    // Refresh the file list by clearing selection and letting it reload
    setSelectedFileName(fileName);
    setIsNewFile(false);
    // The FileList component will reload files automatically
  };

  const handleCancel = () => {
    setIsNewFile(false);
    setSelectedFileId(null);
    setSelectedFileName(null);
  };

  return (
    // <WalletProvider>
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
                  Markdown Editor
                </h1>
                <p className={styles.logoSubtitle}>
                  Powered by Tusky storage
                </p>
              </div>
            </div>
            {/* <div className={styles.headerActions}>
              <ConnectButton />
            </div> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.editorLayout}>
          <div className={styles.sidebar}>
            <FileList 
              onFileSelect={handleFileSelect}
              onAddArticle={handleAddArticle}
              selectedFileId={selectedFileId}
            />
          </div>
          <div className={styles.editorPane}>
            <MarkdownEditor
              fileId={selectedFileId}
              fileName={selectedFileName}
              isNewFile={isNewFile}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>
            Markdown editor built with ❤️ for the decentralized web. Powered by{' '}
            <a
              href="https://tusky.io"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Tusky
            </a>
            .
          </p>
        </div>
      </footer>
      </div>
    // </WalletProvider>
  );
}

export default App;
