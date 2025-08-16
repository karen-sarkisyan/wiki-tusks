import React, { useRef, useState, useEffect } from 'react';
import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, CodeToggle, CreateLink, InsertThematicBreak, ListsToggle, BlockTypeSelect, type MDXEditorMethods } from '@mdxeditor/editor';
import { TuskyService } from '../services/tuskyService';
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
  onCancel 
}) => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(isNewFile);
  const [isSaving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState(fileName || 'new-article.md');
  
  const editorRef = useRef<MDXEditorMethods>(null);
  const tuskyService = useRef<TuskyService | null>(null);

  if (!tuskyService.current) {
    tuskyService.current = TuskyService.getInstance();
  }

  useEffect(() => {
    if (fileId && !isNewFile) {
      loadFileContent();
    } else if (isNewFile) {
      setContent('# New Article\n\nStart writing your content here...');
      setIsEditing(true);
    }
  }, [fileId, isNewFile]);

  const loadFileContent = async () => {
    if (!fileId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fileContent = await tuskyService.current!.readFileContent(fileId);
      if (fileContent) {
        setContent(fileContent);
      } else {
        setError('Failed to load file content');
      }
    } catch (error) {
      setError('Error loading file');
      console.error('Error loading file content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const markdownContent = editorRef.current?.getMarkdown() || content;
      
      // Create a new file with the content
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const file = new File([blob], currentFileName, { type: 'text/markdown' });
      
      const response = await tuskyService.current!.uploadFile(file);
      
      if (response.success) {
        setContent(markdownContent);
        setIsEditing(false);
        onSave(currentFileName);
      } else {
        setError(response.error || 'Failed to save file');
      }
    } catch (error) {
      setError('Error saving file');
      console.error('Error saving file:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNewFile) {
      onCancel();
    } else {
      setIsEditing(false);
      // Reset content to original
      if (editorRef.current) {
        editorRef.current.setMarkdown(content);
      }
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newName = e.target.value;
    if (newName && !newName.endsWith('.md') && !newName.endsWith('.markdown')) {
      newName += '.md';
    }
    setCurrentFileName(newName);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading file content...</div>
      </div>
    );
  }

  if (!fileId && !isNewFile) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <svg className={styles.placeholderIcon} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className={styles.placeholderTitle}>Select a file to edit</h3>
          <p className={styles.placeholderText}>Choose a markdown file from the left panel or create a new article</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.fileInfo}>
          {isNewFile || isEditing ? (
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
          {error && (
            <span className={styles.error}>{error}</span>
          )}
          
          {!isEditing ? (
            <button onClick={handleEdit} className={styles.editButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          ) : (
            <>
              <button 
                onClick={handleCancel} 
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className={styles.saveButton}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editorWrapper}>
            <MDXEditor
              ref={editorRef}
              markdown={content}
              onChange={setContent}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
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
                  )
                })
              ]}
              className={styles.editor}
            />
          </div>
        ) : (
          <div className={styles.preview}>
            <div 
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ 
                __html: content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, match => {
                  const level = match.trim().length;
                  return `</p><h${level}>`;
                }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
