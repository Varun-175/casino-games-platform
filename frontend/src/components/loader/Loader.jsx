// frontend/src/components/Loader/Loader.jsx

import "./Loader.css";

const Loader = ({ message = "Loading your games..." }) => {
  return (
    <div className="casino-loader">
      <div className="loader-ring">
        <div className="loader-neon" />
        <div className="loader-glow" />
      </div>

      <div className="loader-chips">
        <div className="chip chip-1" />
        <div className="chip chip-2" />
        <div className="chip chip-3" />
      </div>

      <div className="loader-text">
        <span className="loader-title">{message}</span>
        <div className="loader-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default Loader;
