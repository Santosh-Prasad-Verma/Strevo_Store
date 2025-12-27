// Search Engine Service Layer
import { createClient } from '@/lib/supabase/client';

export interface SearchResult {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image_url: string;
  stock_quantity: number;
  relevance_score: number;
}

export interface SearchSuggestion {
  suggestion: string;
  type: 'product' | 'category' | 'brand';
  match_type: 'prefix' | 'contains' | 'fuzzy' | 'exact';
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export class SearchEngine {
  private supabase = createClient();

  // Main search with ranking
  async search(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    try {
      const { data, error } = await this.supabase.rpc('search_products', {
        search_query: query,
        category_filter: filters.category || null,
        min_price: filters.minPrice || null,
        max_price: filters.maxPrice || null,
        limit_count: filters.limit || 20
      });

      if (error) {
        // Fallback to simple search
        let queryBuilder = this.supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

        if (filters.category) queryBuilder = queryBuilder.eq('category', filters.category);
        if (filters.minPrice) queryBuilder = queryBuilder.gte('price', filters.minPrice);
        if (filters.maxPrice) queryBuilder = queryBuilder.lte('price', filters.maxPrice);

        const { data: products } = await queryBuilder.limit(filters.limit || 20);
        return (products || []).map(p => ({ ...p, relevance_score: 1 }));
      }

      return data || [];
    } catch (e) {
      return [];
    }
  }

  // Autocomplete suggestions
  async getSuggestions(query: string, limit = 10): Promise<SearchSuggestion[]> {
    try {
      const { data, error } = await this.supabase.rpc('search_suggestions', {
        search_query: query,
        limit_count: limit
      });

      if (error) {
        // Fallback to simple query if RPC fails
        const { data: products } = await this.supabase
          .from('products')
          .select('name, category, brand')
          .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(limit);

        const suggestions: SearchSuggestion[] = [];
        products?.forEach(p => {
          if (p.name) suggestions.push({ suggestion: p.name, type: 'product', match_type: 'contains' });
        });
        return suggestions;
      }

      return data || [];
    } catch (e) {
      return [];
    }
  }

  // Spell correction
  async getDidYouMean(query: string): Promise<string | null> {
    const { data, error } = await this.supabase.rpc('did_you_mean', {
      search_query: query
    });

    if (error) return null;
    return data;
  }

  // Popular searches
  async getPopularSearches(limit = 10): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('popular_searches')
      .select('query')
      .limit(limit);

    if (error) return [];
    return data?.map(d => d.query) || [];
  }

  // Log search for analytics
  async logSearch(query: string, resultsCount: number, userId?: string): Promise<void> {
    await this.supabase.from('search_history').insert({
      user_id: userId || null,
      query,
      results_count: resultsCount
    });
  }

  // Log clicked product
  async logClick(searchQuery: string, productId: number, userId?: string): Promise<void> {
    await this.supabase.from('search_history').insert({
      user_id: userId || null,
      query: searchQuery,
      clicked_product_id: productId
    });
  }

  // Get user search history
  async getUserHistory(userId: string, limit = 10): Promise<string[]> {
    const { data } = await this.supabase
      .from('search_history')
      .select('query')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return [...new Set(data?.map(d => d.query) || [])];
  }

  // Expand query with synonyms
  async expandWithSynonyms(query: string): Promise<string[]> {
    const { data } = await this.supabase
      .from('search_synonyms')
      .select('synonyms')
      .ilike('word', query);

    if (!data || data.length === 0) return [query];
    return [query, ...data[0].synonyms];
  }
}
