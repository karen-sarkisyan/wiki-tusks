import React, { useRef, useState, useEffect } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  BlockTypeSelect,
  type MDXEditorMethods,
} from '@mdxeditor/editor';
import {
  useArticle,
  useAddArticle,
  useUpdateArticle,
} from '../hooks/useArticles';
import styles from './MarkdownEditor.module.css';
import '@mdxeditor/editor/style.css';

interface MarkdownEditorProps {
  fileId: string | null;
  fileName: string | null;
  isNewFile: boolean;
  onSave: (fileName: string) => void;
  onCancel: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  fileId,
  fileName,
  isNewFile,
  onSave,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(isNewFile);
  const [currentFileName, setCurrentFileName] = useState(
    isNewFile ? 'new-article' : fileName || ''
  );

  const editorRef = useRef<MDXEditorMethods>(null);

  const {
    data: articleContent,
    isLoading: loading,
    error: loadError,
  } = useArticle(fileId);

  const addArticleMutation = useAddArticle();
  const updateArticleMutation = useUpdateArticle();

  useEffect(() => {
    setIsEditing(isNewFile);
    if (!isNewFile && fileName) {
      setCurrentFileName(fileName);
    }
  }, [isNewFile, fileName]);

  // Update editor content when article content is loaded (only for existing articles)
  useEffect(() => {
    if (editorRef.current && articleContent && !isNewFile) {
      editorRef.current.setMarkdown(articleContent);
    }
  }, [articleContent, isNewFile]);

  const handleSave = async () => {
    const markdownContent = editorRef.current?.getMarkdown() || '';
    if (!markdownContent) {
      // @TODO: handle this better
      return;
    }

    if (isNewFile) {
      // Create new article
      const article = {
        title: currentFileName, // Use filename directly as title
      };

      addArticleMutation.mutate(
        {
          article,
          markdownContent,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            onSave(currentFileName);
          },
          onError: (error: Error) => {
            console.error('Error saving article:', error);
          },
        }
      );
    } else if (fileId) {
      // For existing articles, we need to upload the new content to Walrus
      // This would create a new blob ID, so this is effectively creating a new version
      // For now, we'll treat this as updating metadata only
      // TODO: Implement proper content update to Walrus
      console.warn(
        'Content updates not yet implemented - would need to upload to Walrus'
      );
      setIsEditing(false);
      onSave(currentFileName);
    }
  };

  const handleCancel = () => {
    if (isNewFile) {
      onCancel();
    } else {
      setIsEditing(false);
      // Reset content to original
      if (editorRef.current && articleContent) {
        editorRef.current.setMarkdown(articleContent);
      }
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentFileName(newName);
  };

  if (loading && !isNewFile) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading article content...</div>
      </div>
    );
  }

  if (!fileId && !isNewFile) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <svg
            className={styles.placeholderIcon}
            width="64"
            height="64"
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
          <h3 className={styles.placeholderTitle}>Select an article to edit</h3>
          <p className={styles.placeholderText}>
            Choose an article from the left panel or create a new article
          </p>
        </div>
      </div>
    );
  }

  const isPending =
    addArticleMutation.isPending || updateArticleMutation.isPending;
  const hasError =
    loadError || addArticleMutation.error || updateArticleMutation.error;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.fileInfo}>
          {isNewFile ? (
            <input
              type="text"
              value={currentFileName}
              onChange={handleFileNameChange}
              className={styles.fileNameInput}
              placeholder="Enter filename..."
            />
          ) : (
            <h2 className={styles.fileName}>{fileName}</h2>
          )}
        </div>

        <div className={styles.actions}>
          {hasError && (
            <span className={styles.error}>
              {loadError instanceof Error
                ? loadError.message
                : addArticleMutation.error instanceof Error
                ? addArticleMutation.error.message
                : updateArticleMutation.error instanceof Error
                ? updateArticleMutation.error.message
                : 'An error occurred'}
            </span>
          )}

          {!isEditing && !isNewFile ? (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          ) : (
            isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={styles.saveButton}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <svg
                        className={styles.spinner}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeOpacity="0.3"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
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
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </>
            )
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.editorWrapper}>
          <MDXEditor
            key={fileId || 'new-file'}
            ref={editorRef}
            markdown={isNewFile ? '' : ''} // Placeholder - you'll need to add content field to Article type
            readOnly={!isEditing}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
              ...(isEditing
                ? [
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <BlockTypeSelect />
                          <BoldItalicUnderlineToggles />
                          <CodeToggle />
                          <CreateLink />
                          <ListsToggle />
                          <InsertThematicBreak />
                        </>
                      ),
                    }),
                  ]
                : []),
            ]}
            className={styles.editor}
          />
        </div>
      </div>
    </div>
  );
};
