// src/components/EmptyState/EmptyState.jsx
import './EmptyState.css';

const EmptyState = ({ message = "No games found" }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">🎲</div>
      <h2 className="empty-title">No Games Available</h2>
      <p className="empty-message">{message}</p>
      <div className="empty-hint">Try adjusting your filters or search terms</div>
    </div>
  );
};

export default EmptyState;
