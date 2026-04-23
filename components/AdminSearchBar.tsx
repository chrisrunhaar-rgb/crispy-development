'use client';

import { useState, useCallback } from 'react';

interface AdminSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function AdminSearchBar({
  onSearch,
  placeholder = 'Search...',
}: AdminSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
        <span style={{ fontSize: '18px', color: '#6B7280' }}>🔍</span>
        <input
          type="text"
          className="ds-search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          aria-label="Search"
          style={{ flex: 1 }}
        />
      </div>
      {query && (
        <button
          className="ds-btn-icon"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}
