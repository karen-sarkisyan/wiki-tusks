import React from 'react';
import { UploadResponse } from '../types';
import styles from './UploadResult.module.css';

interface UploadResultProps {
  result: UploadResponse;
  onReset: () => void;
}

export const UploadResult: React.FC<UploadResultProps> = ({ result, onReset }) => {
  if (!result.success) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successHeader}>
          <div>
            <svg
              className={styles.successIcon}
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
          <div className={styles.successContent}>
            <h3 className={styles.successTitle}>
              Upload Successful!
            </h3>
            <p className={styles.successMessage}>
              {result.message}
            </p>
          </div>
        </div>

        {result.blobId && (
          <div className={styles.fileInfo}>
            <div className={styles.infoCard}>
              <h4 className={styles.infoTitle}>
                File Information
              </h4>
              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Blob ID:</span>
                  <code className={styles.infoValue}>
                    {result.blobId}
                  </code>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Status:</span>
                  <span className={`${styles.infoValue} ${styles.infoValueStatus}`}>
                    Stored on Walrus
                  </span>
                </div>
                {result.transactionDigest && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Transaction:</span>
                    <code className={`${styles.infoValue} ${styles.infoValueLong}`}>
                      {result.transactionDigest}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h4 className={styles.nextStepsTitle}>
                What happens next?
              </h4>
              <ul className={styles.nextStepsList}>
                <li className={styles.nextStepsItem}>• Your file is now stored on the decentralized Walrus network</li>
                <li className={styles.nextStepsItem}>• The file is publicly accessible using the Blob ID</li>
                <li className={styles.nextStepsItem}>• Storage costs are approximately 5x the file size</li>
                <li className={styles.nextStepsItem}>• The file will be available as long as the network maintains it</li>
              </ul>
            </div>

            <div className={styles.warning}>
              <h4 className={styles.warningTitle}>
                ⚠️ Important Notes
              </h4>
              <ul className={styles.warningList}>
                <li className={styles.warningItem}>• All files stored in Walrus are public and discoverable</li>
                <li className={styles.warningItem}>• Do not upload sensitive or private information</li>
                <li className={styles.warningItem}>• Consider encrypting content before upload if privacy is needed</li>
              </ul>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={onReset}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            Upload Another File
          </button>
          {result.blobId && (
            <button
              onClick={() => navigator.clipboard.writeText(result.blobId!)}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Copy Blob ID
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
