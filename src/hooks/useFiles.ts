import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WalrusHttpService } from '../services/walrusHttpService';

export interface FileItem {
  id: string;
  name: string;
}

// Helper class to manage file list in localStorage
class FileListManager {
  private static readonly STORAGE_KEY = 'walrus-files';

  static getFileList(): FileItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading file list from localStorage:', error);
      return [];
    }
  }

  static addFile(fileItem: FileItem): void {
    try {
      const currentFiles = this.getFileList();
      const updatedFiles = [
        fileItem,
        ...currentFiles.filter((f) => f.id !== fileItem.id),
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Error saving file to localStorage:', error);
    }
  }

  static removeFile(fileId: string): void {
    try {
      const currentFiles = this.getFileList();
      const updatedFiles = currentFiles.filter((f) => f.id !== fileId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Error removing file from localStorage:', error);
    }
  }
}

// Query keys
export const fileQueryKeys = {
  all: ['files'] as const,
  lists: () => [...fileQueryKeys.all, 'list'] as const,
  content: (fileId: string) =>
    [...fileQueryKeys.all, 'content', fileId] as const,
};

// Hook to fetch file list
export const useFileList = () => {
  return useQuery({
    queryKey: fileQueryKeys.lists(),
    queryFn: async (): Promise<FileItem[]> => {
      const fileList = FileListManager.getFileList();
      // Filter only markdown files
      return fileList.filter(
        (file) => file.name.endsWith('.md') || file.name.endsWith('.markdown')
      );
    },
    staleTime: 30000, // 30 seconds
  });
};

// Hook to fetch file content
export const useFileContent = (fileId: string | null) => {
  return useQuery({
    queryKey: fileQueryKeys.content(fileId || ''),
    queryFn: async (): Promise<string | null> => {
      if (!fileId) return null;
      const walrusService = new WalrusHttpService();
      const data = await walrusService.readFile(fileId);
      if (!data) return null;
      // Convert Uint8Array to string
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(data);
    },
    enabled: !!fileId, // Only run query if fileId exists
    staleTime: 60000, // 1 minute
  });
};

// Hook to upload a new file with optimistic updates
export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const walrusService = new WalrusHttpService();
      const response = await walrusService.uploadFile(file);
      if (!response.success) {
        throw new Error(response.error || 'Upload failed');
      }
      console.log('File upload response', response);
      return {
        ...response,
        fileName: file.name,
      };
    },
    onMutate: async (file: File) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fileQueryKeys.lists() });

      // Snapshot the previous value
      const previousFiles =
        queryClient.getQueryData<FileItem[]>(fileQueryKeys.lists()) || [];

      // Optimistically update to the new value
      const optimisticFile: FileItem = {
        id: `temp-${Date.now()}`, // Temporary ID
        name: file.name,
      };

      queryClient.setQueryData<FileItem[]>(
        fileQueryKeys.lists(),
        (old = []) => [optimisticFile, ...old]
      );

      // Return a context object with the snapshotted value
      return { previousFiles, optimisticFile };
    },
    onError: (_err, _newFile, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFiles) {
        queryClient.setQueryData(fileQueryKeys.lists(), context.previousFiles);
      }
    },
    onSuccess: (data, file, context) => {
      // Create the real file item
      const newFile: FileItem = {
        id: data.blobId || data.transactionDigest || '',
        name: file.name,
      };

      // Save to localStorage
      FileListManager.addFile(newFile);

      // Replace the optimistic file with the real one
      queryClient.setQueryData<FileItem[]>(
        fileQueryKeys.lists(),
        (old = []) => {
          // Remove the optimistic file and add the real one
          return old
            .filter((f) => f.id !== context?.optimisticFile.id)
            .concat(newFile)
            .sort((a, b) => a.name.localeCompare(b.name));
        }
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: fileQueryKeys.lists() });
    },
  });
};

// Hook to refresh file list manually
export const useRefreshFiles = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: fileQueryKeys.lists() });
  };
};
