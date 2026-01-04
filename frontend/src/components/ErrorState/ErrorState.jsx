// src/components/ErrorState/ErrorState.jsx
import './ErrorState.css';

const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Oops! Error Occurred</h2>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          🔄 Try Again
        </button>
      )}
      <div className="error-hint">Please check your connection and try again</div>
    </div>
  );
};

export default ErrorState;
