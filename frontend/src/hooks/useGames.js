// src/hooks/useGames.js (upgraded)
import { useEffect, useState, useCallback } from "react";
import { games as fetchGames } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const useGames = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadGames = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchGames(params, abortSignal);
      setData(res.data || res);  // Handle both {data} and direct array
    } catch (err) {
      if (!abortSignal?.aborted) {
        setError(err.response?.data?.message || 'Failed to load games');
      }
    } finally {
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    const abortController = new AbortController();
    
    loadGames(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [loadGames]);

  const refetch = () => loadGames();

  return { 
    games: data, 
    loading, 
    error, 
    refetch 
  };
};

export default useGames;
