// frontend/src/pages/Favorites.jsx

import { useCallback } from "react";
import useFavorites from "../hooks/useFavorites";
import GameCard from "../components/GameCard/GameCard";
import Loader from "../components/Loader/Loader";
import ErrorState from "../components/ErrorState/ErrorState";
import EmptyState from "../components/EmptyState/EmptyState";

const Favorites = () => {
  const { favorites, loading, error, refetch } = useFavorites();

  /**
   * ✅ Refetch when favorite is toggled
   */
  const handleFavoriteChange = useCallback(
    (update) => {
      // Remove the unfavorited game from list
      if (!update.isFavorite) {
        // Optimistic: remove from UI immediately
        // Or refetch entire list
        refetch();
      }
    },
    [refetch]
  );

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!favorites.length)
    return <EmptyState message="No favorite games yet. Browse games to add favorites!" />;

  return (
    <div>
      <h1 className="page-title">My Favorite Games</h1>
      <div className="games-grid">
        {favorites.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            showFavoriteCount
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
