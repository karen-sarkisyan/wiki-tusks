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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className={styles.logoText}>
                <h1 className={styles.logoTitle}>WikiTusks</h1>
                <p className={styles.logoSubtitle}>Powered by Walrus</p>
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
