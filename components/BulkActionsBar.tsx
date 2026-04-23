'use client';

import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onRemoveSelected?: () => void;
  onMoveToTeam?: (teamId: string) => void;
  onExportSelected?: () => void;
  isLoading?: boolean;
  showMoveToTeam?: boolean;
  teams?: Array<{ id: string; name: string }>;
}

/**
 * Bulk actions bar that appears when items are selected
 * Sticky position at bottom of page during selection
 */
export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onRemoveSelected,
  onMoveToTeam,
  onExportSelected,
  isLoading = false,
  showMoveToTeam = false,
  teams = [],
}) => {
  if (selectedCount === 0) return null;

  const isAllSelected = selectedCount === totalCount;

  return (
    <div className="bulk-actions-bar">
      {/* Selection info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          {selectedCount} selected
        </span>

        {selectedCount < totalCount && (
          <button
            onClick={onSelectAll}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'oklch(97% 0.005 80)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline',
              opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            Select all {totalCount}
          </button>
        )}

        {isAllSelected && (
          <button
            onClick={onDeselectAll}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'oklch(97% 0.005 80)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline',
              opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            Deselect all
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onExportSelected && (
          <button
            onClick={onExportSelected}
            disabled={isLoading}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid oklch(97% 0.005 80 / 0.3)',
              background: 'transparent',
              color: 'oklch(97% 0.005 80)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.background =
                  'oklch(97% 0.005 80 / 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.background = 'transparent';
              }
            }}
          >
            Export
          </button>
        )}

        {showMoveToTeam && onMoveToTeam && teams.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                onMoveToTeam(e.target.value);
                e.target.value = '';
              }
            }}
            disabled={isLoading}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid oklch(97% 0.005 80 / 0.3)',
              background: 'transparent',
              color: 'oklch(97% 0.005 80)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <option value="">Move to team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}

        {onRemoveSelected && (
          <button
            onClick={onRemoveSelected}
            disabled={isLoading}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid oklch(55% 0.25 25)',
              background: 'oklch(55% 0.25 25)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                const btn = e.target as HTMLButtonElement;
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 4px 12px rgba(200, 50, 50, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                const btn = e.target as HTMLButtonElement;
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? 'Removing...' : 'Remove selected'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BulkActionsBar;
