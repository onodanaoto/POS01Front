import { useState } from 'react';
import { apiClient } from '../api/client';

interface ApiOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // API呼び出しのラッパー関数
  const callApi = async (endpoint: string, options?: ApiOptions) => {
    setLoading(true);
    try {
      const response = options?.method === 'POST'
        ? await apiClient.post(endpoint, JSON.parse(options.body || '{}'))
        : await apiClient.get(endpoint);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, callApi };
}; 