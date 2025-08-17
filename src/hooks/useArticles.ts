import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JSONBinService } from '../services/jsonBinService';
import { WalrusHttpService } from '../services/walrusHttpService';
import { Article } from '../types';

// Query keys
export const articleQueryKeys = {
  all: ['articles'] as const,
  lists: () => [...articleQueryKeys.all, 'list'] as const,
  detail: (articleId: string) =>
    [...articleQueryKeys.all, 'detail', articleId] as const,
  search: (query: string) =>
    [...articleQueryKeys.all, 'search', query] as const,
};

// Hook to fetch all articles
export const useArticles = () => {
  return useQuery({
    queryKey: articleQueryKeys.lists(),
    queryFn: async (): Promise<Article[]> => {
      const jsonBinService = new JSONBinService();
      return await jsonBinService.getArticles();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Hook to fetch article content from Walrus by ID (which is the blob ID)
export const useArticle = (articleId: string | null) => {
  return useQuery({
    queryKey: articleQueryKeys.detail(articleId || ''),
    queryFn: async (): Promise<string | null> => {
      if (!articleId) return null;

      const walrusHttpService = new WalrusHttpService();
      const fileData = await walrusHttpService.readFile(articleId);

      if (!fileData) return null;

      // Convert Uint8Array to string (assuming it's text content)
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(fileData);
    },
    enabled: !!articleId, // Only run query if articleId exists
    staleTime: 300000, // 5 minutes (content changes less frequently)
  });
};

// Hook to add a new article
export const useAddArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      article,
      markdownContent,
    }: {
      article: Omit<Article, 'id' | 'createdDate'>;
      markdownContent: string;
    }) => {
      // Step 1: Upload markdown content to Walrus
      const walrusHttpService = new WalrusHttpService();

      // Create a File object from the markdown content
      const markdownFile = new File([markdownContent], `${article.title}.md`, {
        type: 'text/markdown',
      });

      const uploadResponse = await walrusHttpService.uploadFile(markdownFile);

      console.log('uploadResponse', uploadResponse);
      if (!uploadResponse.success || !uploadResponse.blobId) {
        throw new Error(
          uploadResponse.error || 'Failed to upload file to Walrus'
        );
      }

      // Step 2: Create article with Walrus blob ID and save to JSONBin
      const newArticle: Article = {
        id: uploadResponse.blobId, // Use Walrus blob ID as article ID
        title: article.title,
        createdDate: new Date().toISOString(),
      };

      const jsonBinService = new JSONBinService();
      await jsonBinService.addArticle(newArticle);

      return newArticle;
    },
    onSuccess: () => {
      // Invalidate and refetch the articles list after successful addition
      queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
    },
  });
};

// Hook to update an existing article
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      updates,
    }: {
      articleId: string;
      updates: Partial<Omit<Article, 'id'>>;
    }) => {
      const jsonBinService = new JSONBinService();
      await jsonBinService.updateArticle(articleId, updates);
      return { articleId, updates };
    },
    onSuccess: (data) => {
      // Invalidate and refetch the articles list and specific article detail
      queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: articleQueryKeys.detail(data.articleId),
      });
    },
  });
};

// Hook to remove an article
export const useRemoveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      const jsonBinService = new JSONBinService();
      await jsonBinService.removeArticle(articleId);
      return articleId;
    },
    onSuccess: (articleId) => {
      // Invalidate and refetch the articles list and remove specific article detail
      queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
      queryClient.removeQueries({
        queryKey: articleQueryKeys.detail(articleId),
      });
    },
  });
};

// Hook to refresh articles manually
export const useRefreshArticles = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
  };
};
