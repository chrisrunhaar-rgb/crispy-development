'use client';

import React, { useState, useMemo } from 'react';
import { AdminCard } from '@/components/AdminCard';
import { StatusIndicator } from '@/components/AdminStatusIndicators';

interface LeaderApp {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  application_text?: string;
  created_at: string;
  status: 'pending' | 'approved';
  reviewed_at?: string;
  team_name?: string;
  member_count?: number;
  member_details?: Array<{ name: string; email: string; completed: number }>;
}

interface TeamLeadersTabProps {
  pendingApplications: LeaderApp[];
  approvedLeaders: LeaderApp[];
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

type SortColumn = 'name' | 'applied' | 'members';
type SortDirection = 'asc' | 'desc';

export default function TeamLeadersTab({
  pendingApplications,
  approvedLeaders,
  onApprove,
  onDecline,
}: TeamLeadersTabProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('applied');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const allLeaders = [
    ...pendingApplications.map(app => ({ ...app, status: 'pending' as const })),
    ...approvedLeaders.map(app => ({ ...app, status: 'approved' as const })),
  ];

  const filteredAndSorted = useMemo(() => {
    let result = [...allLeaders];

    // Apply search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        leader =>
          `${leader.first_name || ''} ${leader.last_name || ''}`.toLowerCase().includes(lowerTerm) ||
          leader.email?.toLowerCase().includes(lowerTerm) ||
          leader.team_name?.toLowerCase().includes(lowerTerm)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter(leader => statusFilter.includes(leader.status));
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
        case 'applied':
          aVal = a.created_at;
          bVal = b.created_at;
          break;
        case 'members':
          aVal = a.member_count || 0;
          bVal = b.member_count || 0;
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
  }, [allLeaders, searchTerm, statusFilter, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (value: string) => {
    setStatusFilter(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setSearchTerm('');
  };

  const hasActiveFilters = statusFilter.length > 0 || searchTerm;

  const sectionHeading: React.CSSProperties = {
    fontFamily: 'var(--font-montserrat)',
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'oklch(52% 0.008 260)',
    marginBottom: '1rem',
  };

  const sortButtonStyle = (column: SortColumn): React.CSSProperties => ({
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: sortColumn === column ? 600 : 500,
    color: sortColumn === column ? 'oklch(30% 0.12 260)' : 'oklch(55% 0.008 260)',
    transition: 'all 200ms',
  });

  return (
    <>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by name, email, or team..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.875rem',
            flex: 1,
            minWidth: '200px',
          }}
          aria-label="Search team leaders"
        />

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {['pending', 'approved'].map(s => (
            <label key={s} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={statusFilter.includes(s)}
                onChange={() => toggleFilter(s)}
                aria-label={`Filter by ${s} status`}
              />
              <span style={{ textTransform: 'capitalize' }}>{s}</span>
            </label>
          ))}
        </div>

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

      {/* Pending Applications */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={sectionHeading}>
            Pending Applications
            {pendingApplications.length > 0 && (
              <span style={{ background: 'oklch(65% 0.15 45)', color: 'white', fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', marginLeft: '0.75rem' }}>
                {pendingApplications.length}
              </span>
            )}
          </h2>
          <button onClick={() => handleSort('applied')} style={sortButtonStyle('applied')}>
            Newest {sortColumn === 'applied' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {filteredAndSorted.filter(l => l.status === 'pending').length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280',
            }}
          >
            No pending applications.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredAndSorted
              .filter(l => l.status === 'pending')
              .map(leader => (
                <AdminCard
                  key={leader.id}
                  title={`${leader.first_name || ''} ${leader.last_name || ''}`.trim() || 'Unknown'}
                  footer={
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => onApprove?.(leader.id)}
                        style={{
                          flex: 1,
                          background: 'oklch(45% 0.14 145)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onDecline?.(leader.id)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          color: 'oklch(65% 0.15 45)',
                          border: '1px solid oklch(65% 0.15 45)',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  }
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>EMAIL</p>
                      <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{leader.email || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>STATUS</p>
                      <StatusIndicator type="pending" />
                    </div>
                    {leader.application_text && (
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>MESSAGE</p>
                        <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>{leader.application_text}</p>
                      </div>
                    )}
                  </div>
                </AdminCard>
              ))}
          </div>
        )}
      </section>

      {/* Approved Leaders */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={sectionHeading}>
            Approved Leaders ({approvedLeaders.length})
          </h2>
          <button onClick={() => handleSort('members')} style={sortButtonStyle('members')}>
            Members {sortColumn === 'members' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {filteredAndSorted.filter(l => l.status === 'approved').length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280',
            }}
          >
            No approved leaders.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredAndSorted
              .filter(l => l.status === 'approved')
              .map(leader => (
                <AdminCard
                  key={leader.id}
                  title={leader.team_name || `${leader.first_name || ''} ${leader.last_name || ''}`.trim() || 'Unknown'}
                  expandable={true}
                  defaultExpanded={false}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>LEADER</p>
                      <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{`${leader.first_name || ''} ${leader.last_name || ''}`.trim() || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>EMAIL</p>
                      <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{leader.email || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>STATUS</p>
                      <StatusIndicator type="approved" date={leader.reviewed_at} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>TEAM MEMBERS</p>
                      <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{leader.member_count || 0} members</p>
                    </div>

                    {leader.member_details && leader.member_details.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.5rem' }}>MEMBER PROGRESS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {leader.member_details.slice(0, 3).map((member, idx) => (
                            <div key={idx} style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                              <span style={{ fontWeight: 500 }}>{member.name}</span>
                              <span style={{ float: 'right' }}>{member.completed} modules</span>
                            </div>
                          ))}
                          {leader.member_details.length > 3 && (
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                              +{leader.member_details.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </AdminCard>
              ))}
          </div>
        )}
      </section>
    </>
  );
}
