import React from 'react';
import { useArticles, useRefreshArticles } from '../hooks/useArticles';
import styles from './ArticleList.module.css';

interface ArticleListProps {
  onFileSelect: (articleId: string, articleTitle: string) => void;
  onAddArticle: () => void;
  selectedFileId: string | null;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  onFileSelect,
  onAddArticle,
  selectedFileId,
}) => {
  const { data: articles = [], isLoading: loading, error } = useArticles();
  const refreshArticles = useRefreshArticles();

  const handleRefresh = () => {
    refreshArticles();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Articles</h2>
        </div>
        <div className={styles.loading}>Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Articles</h2>
        </div>
        <div className={styles.error}>
          <p>
            {error instanceof Error ? error.message : 'Failed to load articles'}
          </p>
          <button onClick={handleRefresh} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Articles</h2>
        <div className={styles.headerActions}>
          <button onClick={onAddArticle} className={styles.addButton}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Article
          </button>
        </div>
      </div>

      <div className={styles.fileList}>
        {articles.length === 0 ? (
          <div className={styles.empty}>
            <svg
              className={styles.emptyIcon}
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className={styles.emptyText}>No articles found</p>
            <p className={styles.emptySubtext}>
              Click "Add Article" to create your first article
            </p>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className={`${styles.fileItem} ${
                selectedFileId === article.id ? styles.selected : ''
              }`}
              onClick={() => onFileSelect(article.id, article.title)}
            >
              <svg
                className={styles.fileIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className={styles.fileName}>{article.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
