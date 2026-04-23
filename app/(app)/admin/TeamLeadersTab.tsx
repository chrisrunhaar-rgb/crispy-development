'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminCard } from '@/components/AdminCard';
import { StatusIndicator } from '@/components/AdminStatusIndicators';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { approveApplication, declineApplication } from './actions';

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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'decline';
    applicationId: string;
    userId: string;
    leaderName: string;
  }>({
    isOpen: false,
    type: 'approve',
    applicationId: '',
    userId: '',
    leaderName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, dismissToast, success, error } = useToast();

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

  /**
   * Open confirmation dialog before approving
   */
  const handleApproveClick = (id: string, userId: string, leaderName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'approve',
      applicationId: id,
      userId,
      leaderName,
    });
  };

  /**
   * Open confirmation dialog before declining
   */
  const handleDeclineClick = (id: string, userId: string, leaderName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'decline',
      applicationId: id,
      userId,
      leaderName,
    });
  };

  /**
   * Execute the confirmed action
   */
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('applicationId', confirmDialog.applicationId);
      formData.append('userId', confirmDialog.userId);

      if (confirmDialog.type === 'approve') {
        await approveApplication(formData);
        success(`Team leader "${confirmDialog.leaderName}" approved successfully!`);
      } else {
        await declineApplication(formData);
        success(`Application from "${confirmDialog.leaderName}" declined.`);
      }

      setConfirmDialog({ isOpen: false, type: 'approve', applicationId: '', userId: '', leaderName: '' });
    } catch (err) {
      error(`Failed to ${confirmDialog.type} application. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

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
                        onClick={() => handleApproveClick(leader.id, leader.user_id, `${leader.first_name || ''} ${leader.last_name || ''}`.trim() || 'Unknown')}
                        disabled={isLoading}
                        style={{
                          flex: 1,
                          background: 'oklch(45% 0.14 145)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          opacity: isLoading ? 0.6 : 1,
                        }}
                      >
                        {isLoading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDeclineClick(leader.id, leader.user_id, `${leader.first_name || ''} ${leader.last_name || ''}`.trim() || 'Unknown')}
                        disabled={isLoading}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          color: 'oklch(65% 0.15 45)',
                          border: '1px solid oklch(65% 0.15 45)',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          opacity: isLoading ? 0.6 : 1,
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
                  headerAction={
                    leader.user_id ? (
                      <Link
                        href={`/dashboard?tab=team&leader=${leader.user_id}`}
                        title={`View ${leader.team_name || 'Team'} Dashboard`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          minHeight: '44px',
                          minWidth: '44px',
                          borderRadius: '6px',
                          background: '#6EE7B7',
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '16px',
                          fontWeight: 600,
                          transition: 'all 200ms',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        aria-label={`View ${leader.team_name || 'Team'} Dashboard`}
                      >
                        →
                      </Link>
                    ) : null
                  }
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'approve' ? 'Approve Team Leader?' : 'Decline Application?'}
        message={
          confirmDialog.type === 'approve'
            ? `Approve ${confirmDialog.leaderName} as a team leader? They'll gain access to create and manage teams.`
            : `Decline the application from ${confirmDialog.leaderName}? They can apply again later.`
        }
        confirmText={confirmDialog.type === 'approve' ? 'Approve' : 'Decline'}
        isDangerous={confirmDialog.type === 'decline'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        isLoading={isLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
