'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { BulkActionsBar } from './BulkActionsBar';
import { exportSingleRow } from '@/lib/admin-export';

interface Member {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  status: 'active' | 'inactive' | 'pending';
  pathway?: 'personal' | 'team' | 'peer';
  completedModules?: number;
  team?: boolean;
  peer?: boolean;
  tests?: number;
  timezone?: string | null;
}

type SortColumn = 'name' | 'pathway' | 'team' | 'peer' | 'modules' | 'tests' | 'timezone' | 'lastLogin' | 'joined';
type SortDirection = 'asc' | 'desc';

interface AdminMembersTableProps {
  members: Member[];
  onEdit?: (memberId: string) => void;
  onDelete?: (memberId: string) => void;
  onDeleteMultiple?: (memberIds: string[]) => Promise<void>;
  onExport?: (members: Member[]) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  testCount?: number;
}

function getPathwayColor(pathway?: string) {
  switch (pathway) {
    case 'team':
      return 'ds-badge-emerald';
    case 'peer':
      return 'ds-badge-red';
    case 'personal':
    default:
      return 'ds-badge-indigo';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <span className="ds-status-active">
          Active
        </span>
      );
    case 'pending':
      return (
        <span className="ds-status-pending">
          ⏳ Pending Review
        </span>
      );
    case 'inactive':
    default:
      return (
        <span className="ds-status-inactive">
          Inactive
        </span>
      );
  }
}

function getInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return '?';
}

function getAvatarColor(id: string): string {
  const colors = [
    '#818CF8', // indigo
    '#6EE7B7', // emerald
    '#F87171', // red
    '#FBBF24', // amber
    '#60A5FA', // blue
  ];
  const index = id.charCodeAt(0) % colors.length;
  return colors[index];
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminMembersTable({
  members,
  onEdit,
  onDelete,
  onDeleteMultiple,
  onExport,
  showSearch = true,
  showFilters = true,
  testCount = 4,
}: AdminMembersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('joined');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [pathwayFilter, setPathwayFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const debouncedSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Filter and sort data
  const filteredAndSorted = useMemo(() => {
    let result = [...members];

    // Apply search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        m =>
          (m.first_name?.toLowerCase() || '').includes(lowerTerm) ||
          (m.last_name?.toLowerCase() || '').includes(lowerTerm) ||
          m.email.toLowerCase().includes(lowerTerm)
      );
    }

    // Apply filters
    if (pathwayFilter.length > 0) {
      result = result.filter(m => pathwayFilter.includes(m.pathway || 'personal'));
    }

    if (statusFilter.length > 0) {
      result = result.filter(m => statusFilter.includes(m.status));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number | null = null;
      let bVal: string | number | null = null;

      switch (sortColumn) {
        case 'name':
          aVal = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
          bVal = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
          break;
        case 'pathway':
          aVal = a.pathway || 'personal';
          bVal = b.pathway || 'personal';
          break;
        case 'team':
          aVal = a.team ? 1 : 0;
          bVal = b.team ? 1 : 0;
          break;
        case 'peer':
          aVal = a.peer ? 1 : 0;
          bVal = b.peer ? 1 : 0;
          break;
        case 'modules':
          aVal = a.completedModules || 0;
          bVal = b.completedModules || 0;
          break;
        case 'tests':
          aVal = a.tests || 0;
          bVal = b.tests || 0;
          break;
        case 'timezone':
          aVal = a.timezone || '';
          bVal = b.timezone || '';
          break;
        case 'lastLogin':
          aVal = a.last_sign_in_at || '';
          bVal = b.last_sign_in_at || '';
          break;
        case 'joined':
          aVal = a.created_at || '';
          bVal = b.created_at || '';
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
  }, [members, searchTerm, pathwayFilter, statusFilter, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (type: 'pathway' | 'status', value: string) => {
    if (type === 'pathway') {
      setPathwayFilter(prev =>
        prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
      );
    } else {
      setStatusFilter(prev =>
        prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
      );
    }
  };

  const clearFilters = () => {
    setPathwayFilter([]);
    setStatusFilter([]);
    setSearchTerm('');
  };

  const hasActiveFilters = pathwayFilter.length > 0 || statusFilter.length > 0 || searchTerm;

  // Checkbox handlers
  const toggleRowSelection = useCallback((memberId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    const allIds = new Set(filteredAndSorted.map(m => m.id));
    setSelectedIds(allIds);
  }, [filteredAndSorted]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (!onDeleteMultiple || selectedIds.size === 0) return;
    setIsLoading(true);
    try {
      await onDeleteMultiple(Array.from(selectedIds));
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [selectedIds, onDeleteMultiple]);

  const handleExportSelected = useCallback(() => {
    if (onExport && selectedIds.size > 0) {
      const selectedMembers = members.filter(m => selectedIds.has(m.id));
      onExport(selectedMembers);
    }
  }, [selectedIds, members, onExport]);

  // Update indeterminate state on header checkbox
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = selectedIds.size > 0 && selectedIds.size < filteredAndSorted.length;
    }
  }, [selectedIds, filteredAndSorted.length]);

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (members.length === 0) {
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
          👥
        </div>
        <h3 className="ds-h3" style={{ marginBottom: '8px' }}>
          No members yet
        </h3>
        <p className="ds-small" style={{ textAlign: 'center', color: '#6B7280' }}>
          Invite members to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingBottom: selectedIds.size > 0 ? '5rem' : '0' }}>
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.size}
          totalCount={filteredAndSorted.length}
          onSelectAll={selectAllVisible}
          onDeselectAll={deselectAll}
          onRemoveSelected={handleDeleteSelected}
          onExportSelected={handleExportSelected}
          isLoading={isLoading}
        />
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {showSearch && (
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => debouncedSearch(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.875rem',
              }}
              aria-label="Search members"
            />
          )}

          {showFilters && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Pathway filter */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Pathway:</label>
                {['personal', 'team', 'peer'].map(p => (
                  <label key={p} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={pathwayFilter.includes(p)}
                      onChange={() => toggleFilter('pathway', p)}
                      aria-label={`Filter by ${p} pathway`}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{p}</span>
                  </label>
                ))}
              </div>

              {/* Status filter */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Status:</label>
                {['active', 'pending', 'inactive'].map(s => (
                  <label key={s} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(s)}
                      onChange={() => toggleFilter('status', s)}
                      aria-label={`Filter by ${s} status`}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{s}</span>
                  </label>
                ))}
              </div>

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
        Showing {filteredAndSorted.length} of {members.length} members
        {hasActiveFilters && ' (filtered)'}
      </div>

      {filteredAndSorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
          No members match your search or filters.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead className="ds-table-header">
              <tr>
                <th style={{ width: '3%', textAlign: 'center' }}>
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size === filteredAndSorted.length}
                    onChange={() => {
                      if (selectedIds.size === filteredAndSorted.length) {
                        deselectAll();
                      } else {
                        selectAllVisible();
                      }
                    }}
                    aria-label="Select all visible members"
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </th>
                <th style={{ width: '22%', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Name <SortIcon column="name" />
                </th>
                <th style={{ width: '18%', cursor: 'pointer' }} onClick={() => handleSort('pathway')}>
                  Pathway <SortIcon column="pathway" />
                </th>
                <th style={{ width: '9%', cursor: 'pointer' }} onClick={() => handleSort('team')}>
                  Team <SortIcon column="team" />
                </th>
                <th style={{ width: '9%', cursor: 'pointer' }} onClick={() => handleSort('peer')}>
                  Peer <SortIcon column="peer" />
                </th>
                <th style={{ width: '9%', cursor: 'pointer' }} onClick={() => handleSort('modules')}>
                  Modules <SortIcon column="modules" />
                </th>
                <th style={{ width: '9%', cursor: 'pointer' }} onClick={() => handleSort('tests')}>
                  Tests <SortIcon column="tests" />
                </th>
                <th style={{ width: '14%', cursor: 'pointer' }} onClick={() => handleSort('lastLogin')}>
                  Last Login <SortIcon column="lastLogin" />
                </th>
                <th style={{ width: '14%', cursor: 'pointer' }} onClick={() => handleSort('joined')}>
                  Joined <SortIcon column="joined" />
                </th>
              </tr>
            </thead>
            <tbody className="ds-table-body">
              {filteredAndSorted.map((member) => {
                const name =
                  member.first_name || member.last_name
                    ? `${member.first_name || ''} ${member.last_name || ''}`.trim()
                    : member.email;
                const initials = getInitials(member.first_name, member.last_name, member.email);
                const avatarBg = getAvatarColor(member.id);
                const isSelected = selectedIds.has(member.id);

                return (
                  <tr
                    key={member.id}
                    className="ds-table-row-hover"
                    style={{
                      backgroundColor: isSelected ? 'oklch(97% 0.005 80 / 0.05)' : 'transparent',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(member.id)}
                        aria-label={`Select ${name}`}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td data-label="Name">
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: avatarBg,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                          title={`Avatar for ${name}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#1F2937' }}>{name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Pathway">
                      {member.pathway && (
                        <span className={`ds-badge ${getPathwayColor(member.pathway)}`}>
                          {member.pathway === 'personal' && '🧑'}
                          {member.pathway === 'team' && '👥'}
                          {member.pathway === 'peer' && '🤝'}
                          {' '}
                          {member.pathway.charAt(0).toUpperCase() + member.pathway.slice(1)}
                        </span>
                      )}
                    </td>
                    <td data-label="Team" style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '500', color: member.team ? '#10B981' : '#9CA3AF' }}>
                        {member.team ? '✓' : '—'}
                      </span>
                    </td>
                    <td data-label="Peer" style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '500', color: member.peer ? '#10B981' : '#9CA3AF' }}>
                        {member.peer ? '✓' : '—'}
                      </span>
                    </td>
                    <td data-label="Modules" style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '500', color: (member.completedModules ?? 0) > 0 ? '#1F2937' : '#9CA3AF' }}>
                        {member.completedModules ?? 0}
                      </span>
                    </td>
                    <td data-label="Tests" style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '500', color: (member.tests ?? 0) > 0 ? '#10B981' : '#9CA3AF' }}>
                        {member.tests ?? 0}/{testCount}
                      </span>
                    </td>
                    <td data-label="Last Login">
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {formatDate(member.last_sign_in_at)}
                      </span>
                    </td>
                    <td data-label="Joined">
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {formatDate(member.created_at)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
