import { Article, ArticleDatabase, JSONBinResponse } from '../types';

export class JSONBinService {
  private readonly baseUrl = 'https://api.jsonbin.io/v3/b';
  private readonly apiKey: string = import.meta.env.VITE_JSONBIN_API_KEY || '';
  private readonly binId: string = import.meta.env.VITE_JSONBIN_BIN_ID || '';

  /**
   * Fetch the current articles database
   */
  async getArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        method: 'GET',
        headers: {
          'X-Access-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch articles: ${response.status} ${response.statusText}`
        );
      }

      const data: JSONBinResponse<ArticleDatabase> = await response.json();
      return data.record.articles || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  /**
   * Add a new article to the database
   */
  async addArticle(
    article: Omit<Article, 'createdDate'> | Article
  ): Promise<void> {
    try {
      // First, get the current articles
      const currentArticles = await this.getArticles();

      // Check if article already exists
      if (
        currentArticles.some(
          (existingArticle) => existingArticle.id === article.id
        )
      ) {
        console.warn(`Article ${article.id} already exists in database`);
        return;
      }

      // Create the article with createdDate if not provided
      const newArticle: Article = {
        ...article,
        createdDate:
          'createdDate' in article
            ? article.createdDate
            : new Date().toISOString(),
      };

      // Add the new article
      const updatedDatabase: ArticleDatabase = {
        articles: [...currentArticles, newArticle],
      };

      await this.updateDatabase(updatedDatabase);
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  }

  /**
   * Remove an article from the database by ID
   */
  async removeArticle(articleId: string): Promise<void> {
    try {
      // Get the current articles
      const currentArticles = await this.getArticles();

      // Filter out the article to remove
      const updatedArticles = currentArticles.filter(
        (article) => article.id !== articleId
      );

      // Check if article was found and removed
      if (updatedArticles.length === currentArticles.length) {
        console.warn(`Article ${articleId} not found in database`);
        return;
      }

      const updatedDatabase: ArticleDatabase = {
        articles: updatedArticles,
      };

      await this.updateDatabase(updatedDatabase);
    } catch (error) {
      console.error('Error removing article:', error);
      throw error;
    }
  }

  /**
   * Private method to update the entire database
   */
  private async updateDatabase(database: ArticleDatabase): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'X-Access-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(database),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update database: ${response.status} ${response.statusText}`
        );
      }

      console.log('Database updated successfully');
    } catch (error) {
      console.error('Error updating database:', error);
      throw error;
    }
  }

  /**
   * Update an existing article
   */
  async updateArticle(
    articleId: string,
    updates: Partial<Omit<Article, 'id'>>
  ): Promise<void> {
    try {
      const currentArticles = await this.getArticles();
      const articleIndex = currentArticles.findIndex(
        (article) => article.id === articleId
      );

      if (articleIndex === -1) {
        throw new Error(`Article ${articleId} not found in database`);
      }

      // Update the article
      const updatedArticle: Article = {
        ...currentArticles[articleIndex],
        ...updates,
      };

      const updatedArticles = [...currentArticles];
      updatedArticles[articleIndex] = updatedArticle;

      const updatedDatabase: ArticleDatabase = {
        articles: updatedArticles,
      };

      await this.updateDatabase(updatedDatabase);
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }
}
