import { useState } from 'react';
import { ArticleList } from './components/ArticleList';
import { MarkdownEditor } from './components/MarkdownEditor';
// import { WalletProvider, ConnectButton } from './components/WalletProvider';
import styles from './App.module.css';

function App() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [selectedArticleTitle, setSelectedArticleTitle] = useState<
    string | null
  >(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  const handleArticleSelect = (articleId: string, articleTitle: string) => {
    setSelectedArticleId(articleId);
    setSelectedArticleTitle(articleTitle);
    setIsNewArticle(false);
  };

  const handleAddArticle = () => {
    setSelectedArticleId(null);
    setSelectedArticleTitle(null);
    setIsNewArticle(true);
  };

  const handleSave = (articleTitle: string) => {
    // With React Query optimistic updates, the article list will update automatically
    setSelectedArticleTitle(articleTitle);
    setIsNewArticle(false);
  };

  const handleCancel = () => {
    setIsNewArticle(false);
    setSelectedArticleId(null);
    setSelectedArticleTitle(null);
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
                  {/* Walrus head outline */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8c0-2 2-4 7-4s7 2 7 4c0 1.5-1 3-2 4"
                  />
                  {/* Left tusk */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12c0 0-0.5 6 1 10"
                  />
                  {/* Right tusk */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 12c0 0 0.5 6-1 10"
                  />
                  {/* Walrus snout */}
                  <ellipse
                    cx="12"
                    cy="10"
                    rx="2.5"
                    ry="1.5"
                    strokeWidth={1.5}
                  />
                </svg>
              </div>
              <div className={styles.logoText}>
                <h1 className={styles.logoTitle}>WikiTusks</h1>
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
            <ArticleList
              onFileSelect={handleArticleSelect}
              onAddArticle={handleAddArticle}
              selectedFileId={selectedArticleId}
            />
          </div>
          <div className={styles.editorPane}>
            <MarkdownEditor
              fileId={selectedArticleId}
              fileName={selectedArticleTitle}
              isNewFile={isNewArticle}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>Built with ❤️ using React, TypeScript, and Walrus</p>
        </div>
      </footer>
    </div>
    // </WalletProvider>
  );
}

export default App;
