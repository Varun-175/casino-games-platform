// frontend/src/pages/Games.jsx - PAGINATED v2.0

import { useState, useCallback } from "react";
import useGames from "../hooks/useGames";
import GameCard from "../components/GameCard/GameCard";
import Loader from "../components/Loader/Loader";
import ErrorState from "../components/ErrorState/ErrorState";
import EmptyState from "../components/EmptyState/EmptyState";
import FilterBar from "../components/FilterBar/FilterBar";
import Pagination from "../components/Pagination/Pagination"; // ← ADD THIS

const Games = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 12 }); // ← ADD page/limit
  const { games, loading, error, refetch, pagination } = useGames(filters); // ← pagination from hook

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page })); // ← ADD THIS
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!games?.length) return <EmptyState message="No games found" />;

  return (
    <>
      <FilterBar onChange={(newFilters) => 
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 })) // ← Reset page on filter
      } />
      
      <div className="games-grid">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            showFavoriteCount // ← Bonus: show counts
          />
        ))}
      </div>
      
      {/* PAGINATION - ADD THIS! */}
      <Pagination 
        currentPage={filters.page}
        totalPages={pagination?.pages || 1}        // Your format
        totalItems={pagination?.total || 0}        // Your format  
        onPageChange={handlePageChange}
        loading={loading}
      />
    </>
  );
};

export default Games;
