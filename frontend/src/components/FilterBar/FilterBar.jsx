// frontend/src/components/FilterBar/FilterBar.jsx

import { useEffect, useState, useRef } from "react";
import { games } from "../../api/client";
import "./FilterBar.css";

const FilterBar = ({ onChange, className = "" }) => {
  const [providers, setProviders] = useState(["All"]);
  const [categories, setCategories] = useState(["All"]);

  const [filters, setFilters] = useState({
    q: "",
    provider: "All",
    category: "All",
  });

  const debounceRef = useRef(null);

  /* ───────────────────────────────
     Load filter options ONCE
  ─────────────────────────────── */
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await games({ limit: 1000 });
        const items = res?.data?.items || [];

        const p = new Set(["All"]);
        const c = new Set(["All"]);

        items.forEach((g) => {
          if (g.provider) p.add(g.provider);
          if (g.category) c.add(g.category);
        });

        if (active) {
          setProviders([...p]);
          setCategories([...c]);
        }
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  /* ───────────────────────────────
     Sync filters → parent (debounced)
  ─────────────────────────────── */
  const syncFilters = (next) => {
    setFilters(next);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange({
        q: next.q,
        provider: next.provider === "All" ? "" : next.provider,
        category: next.category === "All" ? "" : next.category,
        page: 1,
      });
    }, 300);
  };

  return (
    <div className={`filter-bar ${className}`}>
      <div className="filters-wrapper">
        {/* SEARCH */}
        <div className="filter-group">
          <label>Search</label>
          <input
            className="filter-input"
            placeholder="Search games..."
            value={filters.q}
            onChange={(e) =>
              syncFilters({ ...filters, q: e.target.value })
            }
          />
        </div>

        {/* PROVIDER */}
        <div className="filter-group">
          <label>Provider</label>
          <select
            className="filter-select"
            value={filters.provider}
            onChange={(e) =>
              syncFilters({ ...filters, provider: e.target.value })
            }
          >
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORY */}
        <div className="filter-group">
          <label>Category</label>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) =>
              syncFilters({ ...filters, category: e.target.value })
            }
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
