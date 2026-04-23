'use client';

import React, { useState, useMemo, useCallback } from 'react';

interface ContentModule {
  slug: string;
  title: string;
  category: string;
  created_at: string;
  updated_at: string;
  languages: string[];
  reads?: number;
  saves?: number;
}

type SortColumn = 'title' | 'category' | 'created' | 'updated' | 'languages' | 'reads' | 'saves';
type SortDirection = 'asc' | 'desc';

interface AdminContentTableProps {
  modules: ContentModule[];
  showSearch?: boolean;
  showFilters?: boolean;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminContentTable({
  modules,
  showSearch = true,
  showFilters = true,
}: AdminContentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);

  // Get unique categories and languages
  const categories = useMemo(
    () => Array.from(new Set(modules.map(m => m.category))),
    [modules]
  );

  const languages = useMemo(
    () => Array.from(new Set(modules.flatMap(m => m.languages))).sort(),
    [modules]
  );

  const debouncedSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Filter and sort data
  const filteredAndSorted = useMemo(() => {
    let result = [...modules];

    // Apply search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(lowerTerm) ||
          m.category.toLowerCase().includes(lowerTerm)
      );
    }

    // Apply filters
    if (categoryFilter.length > 0) {
      result = result.filter(m => categoryFilter.includes(m.category));
    }

    if (languageFilter.length > 0) {
      result = result.filter(m => m.languages.some(l => languageFilter.includes(l)));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number | null = null;
      let bVal: string | number | null = null;

      switch (sortColumn) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'category':
          aVal = a.category.toLowerCase();
          bVal = b.category.toLowerCase();
          break;
        case 'created':
          aVal = a.created_at;
          bVal = b.created_at;
          break;
        case 'updated':
          aVal = a.updated_at;
          bVal = b.updated_at;
          break;
        case 'languages':
          aVal = a.languages.length;
          bVal = b.languages.length;
          break;
        case 'reads':
          aVal = a.reads || 0;
          bVal = b.reads || 0;
          break;
        case 'saves':
          aVal = a.saves || 0;
          bVal = b.saves || 0;
          break;
      }

      if (aVal === null) aVal = '';
      if (bVal === null) bVal = '';

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return result;
  }, [modules, searchTerm, categoryFilter, languageFilter, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (type: 'category' | 'language', value: string) => {
    if (type === 'category') {
      setCategoryFilter(prev =>
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    } else {
      setLanguageFilter(prev =>
        prev.includes(value) ? prev.filter(l => l !== value) : [...prev, value]
      );
    }
  };

  const clearFilters = () => {
    setCategoryFilter([]);
    setLanguageFilter([]);
    setSearchTerm('');
  };

  const hasActiveFilters = categoryFilter.length > 0 || languageFilter.length > 0 || searchTerm;

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (modules.length === 0) {
    return (
      <div
        style={{
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '48px 24px',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '24px', opacity: 0.5 }}>
          📚
        </div>
        <h3 className="ds-h3" style={{ marginBottom: '8px' }}>
          No content yet
        </h3>
        <p className="ds-small" style={{ textAlign: 'center', color: '#6B7280' }}>
          Create learning modules to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {showSearch && (
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={e => debouncedSearch(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.875rem',
              }}
              aria-label="Search content"
            />
          )}

          {showFilters && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Category filter */}
              {categories.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Category:</label>
                  {categories.map(c => (
                    <label
                      key={c}
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={categoryFilter.includes(c)}
                        onChange={() => toggleFilter('category', c)}
                        aria-label={`Filter by ${c} category`}
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Language filter */}
              {languages.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Language:</label>
                  {languages.map(l => (
                    <label
                      key={l}
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={languageFilter.includes(l)}
                        onChange={() => toggleFilter('language', l)}
                        aria-label={`Filter by ${l} language`}
                      />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Clear filters button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    background: 'transparent',
                    border: '1px solid #E5E7EB',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#6B7280',
                  }}
                  aria-label="Clear all filters"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredAndSorted.length} of {modules.length} modules
        {hasActiveFilters && ' (filtered)'}
      </div>

      {filteredAndSorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
          No modules match your search or filters.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead className="ds-table-header">
              <tr>
                <th style={{ width: '30%', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                  Title <SortIcon column="title" />
                </th>
                <th style={{ width: '20%', cursor: 'pointer' }} onClick={() => handleSort('category')}>
                  Category <SortIcon column="category" />
                </th>
                <th style={{ width: '15%', cursor: 'pointer' }} onClick={() => handleSort('languages')}>
                  Languages <SortIcon column="languages" />
                </th>
                <th style={{ width: '10%', cursor: 'pointer' }} onClick={() => handleSort('reads')}>
                  Reads <SortIcon column="reads" />
                </th>
                <th style={{ width: '10%', cursor: 'pointer' }} onClick={() => handleSort('saves')}>
                  Saves <SortIcon column="saves" />
                </th>
                <th style={{ width: '15%', cursor: 'pointer' }} onClick={() => handleSort('updated')}>
                  Updated <SortIcon column="updated" />
                </th>
              </tr>
            </thead>
            <tbody className="ds-table-body">
              {filteredAndSorted.map((module) => (
                <tr key={module.slug} className="ds-table-row-hover">
                  <td data-label="Title">
                    <span style={{ fontWeight: '500', color: '#1F2937' }}>{module.title}</span>
                  </td>
                  <td data-label="Category">
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{module.category}</span>
                  </td>
                  <td data-label="Languages">
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {module.languages.map(lang => (
                        <span
                          key={lang}
                          style={{
                            fontFamily: 'var(--font-montserrat)',
                            fontWeight: 600,
                            fontSize: '0.6rem',
                            background: '#E5E7EB',
                            color: '#374151',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '3px',
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td data-label="Reads" style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: '500', color: (module.reads ?? 0) > 0 ? '#1F2937' : '#9CA3AF' }}>
                      {module.reads ?? 0}
                    </span>
                  </td>
                  <td data-label="Saves" style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: '500', color: (module.saves ?? 0) > 0 ? '#10B981' : '#9CA3AF' }}>
                      {module.saves ?? 0}
                    </span>
                  </td>
                  <td data-label="Updated">
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {formatDate(module.updated_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
