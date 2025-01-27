import { useState } from 'react';
import { apiClient } from '../api/client';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // API呼び出しのラッパー関数
  const callApi = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, callApi };
}; 