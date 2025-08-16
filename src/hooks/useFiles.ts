import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TuskyService } from '../services/tuskyService';

export interface FileItem {
  id: string;
  name: string;
}

// Query keys
export const fileQueryKeys = {
  all: ['files'] as const,
  lists: () => [...fileQueryKeys.all, 'list'] as const,
  content: (fileId: string) => [...fileQueryKeys.all, 'content', fileId] as const,
};

// Hook to fetch file list
export const useFileList = () => {
  return useQuery({
    queryKey: fileQueryKeys.lists(),
    queryFn: async (): Promise<FileItem[]> => {
      const tuskyService = TuskyService.getInstance();
      const fileList = await tuskyService.listFiles();
      // Filter only markdown files
      return fileList.filter(file => 
        file.name.endsWith('.md') || file.name.endsWith('.markdown')
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
      const tuskyService = TuskyService.getInstance();
      return await tuskyService.readFileContent(fileId);
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
      const tuskyService = TuskyService.getInstance();
      const response = await tuskyService.uploadFile(file);
      if (!response.success) {
        throw new Error(response.error || 'Upload failed');
      }
      return {
        ...response,
        fileName: file.name,
      };
    },
    onMutate: async (file: File) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fileQueryKeys.lists() });

      // Snapshot the previous value
      const previousFiles = queryClient.getQueryData<FileItem[]>(fileQueryKeys.lists()) || [];

      // Optimistically update to the new value
      const optimisticFile: FileItem = {
        id: `temp-${Date.now()}`, // Temporary ID
        name: file.name,
      };

      queryClient.setQueryData<FileItem[]>(fileQueryKeys.lists(), (old = []) => [
        optimisticFile,
        ...old,
      ]);

      // Return a context object with the snapshotted value
      return { previousFiles, optimisticFile };
    },
    onError: (err, newFile, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFiles) {
        queryClient.setQueryData(fileQueryKeys.lists(), context.previousFiles);
      }
    },
    onSuccess: (data, file, context) => {
      // Replace the optimistic file with the real one
      queryClient.setQueryData<FileItem[]>(fileQueryKeys.lists(), (old = []) => {
        const newFile: FileItem = {
          id: data.blobId || data.transactionDigest || '',
          name: file.name,
        };
        
        // Remove the optimistic file and add the real one
        return old
          .filter(f => f.id !== context?.optimisticFile.id)
          .concat(newFile)
          .sort((a, b) => a.name.localeCompare(b.name));
      });
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
