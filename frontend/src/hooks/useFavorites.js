// frontend/src/hooks/useFavorites.js

import { useEffect, useState, useCallback } from "react";
import { favorites } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * ✅ Fetch favorites from backend
   */
  const loadFavorites = useCallback(
    async (signal) => {
      if (!isAuthenticated) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await favorites.list(signal);

        if (!signal?.aborted) {
          // ✅ Handle both response formats
          const items = Array.isArray(res.data)
            ? res.data
            : res.data?.items || [];
          setData(items);
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(err?.message || "Failed to load favorites");
          console.error("Failed to load favorites:", err);
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated]
  );

  // ✅ Initial load
  useEffect(() => {
    const abortController = new AbortController();
    loadFavorites(abortController.signal);
    return () => abortController.abort();
  }, [loadFavorites]);

  /**
   * ✅ Manual refetch
   */
  const refetch = useCallback(() => {
    const abortController = new AbortController();
    loadFavorites(abortController.signal);
  }, [loadFavorites]);

  return {
    favorites: data,
    loading,
    error,
    refetch,
  };
};

export default useFavorites;
