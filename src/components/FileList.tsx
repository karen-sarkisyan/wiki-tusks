import React, { useState, useEffect, useRef } from 'react';
import { TuskyService } from '../services/tuskyService';
import styles from './FileList.module.css';

interface FileItem {
  id: string;
  name: string;
}

interface FileListProps {
  onFileSelect: (fileId: string, fileName: string) => void;
  onAddArticle: () => void;
  selectedFileId: string | null;
}

export const FileList: React.FC<FileListProps> = ({ onFileSelect, onAddArticle, selectedFileId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tuskyService = useRef<TuskyService | null>(null);

  if (!tuskyService.current) {
    tuskyService.current = TuskyService.getInstance();
  }

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fileList = await tuskyService.current!.listFiles();
      // Filter only markdown files
      const markdownFiles = fileList.filter(file => 
        file.name.endsWith('.md') || file.name.endsWith('.markdown')
      );
      setFiles(markdownFiles);
    } catch (error) {
      setError('Failed to load files');
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadFiles();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Files</h2>
        </div>
        <div className={styles.loading}>Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Files</h2>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
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
        <h2 className={styles.title}>Markdown Files</h2>
        <div className={styles.headerActions}>
          <button onClick={handleRefresh} className={styles.refreshButton} title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={onAddArticle} className={styles.addButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Article
          </button>
        </div>
      </div>
      
      <div className={styles.fileList}>
        {files.length === 0 ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className={styles.emptyText}>No markdown files found</p>
            <p className={styles.emptySubtext}>Click "Add Article" to create your first file</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`${styles.fileItem} ${selectedFileId === file.id ? styles.selected : ''}`}
              onClick={() => onFileSelect(file.id, file.name)}
            >
              <svg className={styles.fileIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={styles.fileName}>{file.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
