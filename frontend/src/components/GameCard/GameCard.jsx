// frontend/src/components/GameCard/GameCard.jsx

import { useState, useCallback, useEffect, useRef } from "react";
import { favorites } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import "./GameCard.css";

const GameCard = ({
  game,
  onPlay,
  className = "",
  showFavoriteCount = false,
  onFavoriteChange,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  // ✅ Handle both backend naming conventions
  const [isFavorite, setIsFavorite] = useState(
    Boolean(game.is_favorite ?? game.isFavorite)
  );
  const [loading, setLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(game.favorite_count || 0);

  // ✅ Sync with parent if prop changes
  useEffect(() => {
    setIsFavorite(Boolean(game.is_favorite ?? game.isFavorite));
    setFavoriteCount(game.favorite_count || 0);
  }, [game.is_favorite, game.isFavorite, game.favorite_count]);

  /**
   * ✅ FIXED: Separate add/remove logic
   */
  const toggleFavorite = useCallback(
    async (e) => {
      e.stopPropagation();

      if (!isAuthenticated || loading) return;

      const previousState = isFavorite;
      const previousCount = favoriteCount;

      // ✅ Optimistic UI
      setIsFavorite(!previousState);
      setFavoriteCount((prev) => (previousState ? prev - 1 : prev + 1));
      setLoading(true);

      try {
        if (previousState) {
          // ✅ DELETE (unmark)
          await favorites.remove(game.id);
        } else {
          // ✅ POST (mark)
          await favorites.add(game.id);
        }

        // Notify parent
        onFavoriteChange?.({
          id: game.id,
          isFavorite: !previousState,
          favoriteCount: favoriteCount,
        });
      } catch (err) {
        // ✅ 409 = already exists (treat as success)
        if (err?.status === 409 || err?.response?.status === 409) {
          setIsFavorite(true);
          return;
        }

        // ✅ Real failure → revert
        console.error("Favorite toggle failed:", err);
        setIsFavorite(previousState);
        setFavoriteCount(previousCount);

        // Optional: show toast error
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loading, isFavorite, favoriteCount, game.id, onFavoriteChange]
  );

  const handlePlay = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (onPlay) {
        onPlay(game);
      } else {
        navigate(`/game/${game.id}`);
      }
    },
    [onPlay, navigate, game]
  );

  const handleCardClick = useCallback(
    (e) => {
      // Click card to play (except buttons)
      if (e.target.closest(".favorite-btn, .play-btn")) return;
      handlePlay();
    },
    [handlePlay]
  );

  return (
    <motion.article
      className={`game-card ${className}`}
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Play ${game.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePlay();
        }
      }}
    >
      <div className="game-media">
        <img
          src={game.image_url || "/placeholder-casino.jpg"}
          alt={`${game.name} by ${game.provider || "provider"}`}
          loading="lazy"
          className="game-image"
          decoding="async"
        />

        {game.provider && (
          <span className="game-badge" title={game.provider}>
            <Icon icon="mdi:factory" className="badge-icon" />
            {game.provider}
          </span>
        )}
      </div>

      <div className="game-content">
        <h3 className="game-title" title={game.name}>
          {game.name}
        </h3>

        {game.category && (
          <p className="game-category">
            <Icon icon="mdi:tag-outline" className="category-icon" />
            {game.category}
          </p>
        )}

        <div className="game-footer">
          <motion.button
            ref={buttonRef}
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
            disabled={!isAuthenticated || loading}
            aria-label={
              isAuthenticated
                ? isFavorite
                  ? `Remove ${game.name} from favorites`
                  : `Add ${game.name} to favorites`
                : "Login to favorite games"
            }
            title={isAuthenticated ? "Toggle favorite" : "Login to favorite"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={loading ? { rotate: 360 } : {}}
            transition={{ rotate: { duration: 0.5 } }}
          >
            {loading ? (
              <motion.span
                className="spinner-mini"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ) : (
              <>
                <Icon icon="mdi:cards-heart" className="heart-icon" />
                {showFavoriteCount && favoriteCount > 0 && (
                  <span className="favorite-count">{favoriteCount}</span>
                )}
              </>
            )}
          </motion.button>

          <motion.button
            className="play-btn"
            onClick={handlePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon icon="mdi:play-circle-outline" className="play-icon" />
            PLAY NOW
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default GameCard;
