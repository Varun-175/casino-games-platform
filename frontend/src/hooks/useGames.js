// frontend/src/hooks/useGames.js

import { useEffect, useState, useCallback } from "react";
import { games as fetchGames } from "../api/client";

const useGames = (params = {}) => {
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGames = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(null);

        /**
         * Backend response shape:
         * {
         *   success: true,
         *   data: {
         *     items: [...],
         *     pagination: {...}
         *   }
         * }
         */
        const res = await fetchGames(params, signal);

        if (signal?.aborted) return;

        const items = res?.data?.items;
        const pageInfo = res?.data?.pagination;

        setGames(Array.isArray(items) ? items : []);
        setPagination(pageInfo || null);
      } catch (err) {
        if (!signal?.aborted) {
          setError(err?.message || "Failed to load games");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [JSON.stringify(params)]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadGames(controller.signal);

    return () => controller.abort();
  }, [loadGames]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    loadGames(controller.signal);
  }, [loadGames]);

  return {
    games,        // ✅ actual games array
    pagination,  // ✅ { total, page, limit, pages }
    loading,
    error,
    refetch,
  };
};

export default useGames;
