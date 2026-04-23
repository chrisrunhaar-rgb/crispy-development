'use client';

import React, { useState, useMemo } from 'react';
import { AdminCard } from '@/components/AdminCard';
import { StatusIndicator } from '@/components/AdminStatusIndicators';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { approvePeerApplication, declinePeerApplication } from './actions';

interface PeerApp {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  application_text?: string;
  created_at: string;
  status: 'pending' | 'approved';
  reviewed_at?: string;
}

interface PeerGroup {
  id: string;
  name: string;
  region: string;
  timezone: string;
  language: string;
  is_open: boolean;
  current_topic?: string | null;
  initiator_user_id: string;
  created_at: string;
  memberCount: number;
}

interface PeerInitiatorsTabProps {
  pendingApplications: PeerApp[];
  approvedInitiators: PeerApp[];
  peerGroups: PeerGroup[];
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

type SortColumn = 'name' | 'applied' | 'region' | 'members';
type SortDirection = 'asc' | 'desc';

export default function PeerInitiatorsTab({
  pendingApplications,
  approvedInitiators,
  peerGroups,
  onApprove,
  onDecline,
}: PeerInitiatorsTabProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('applied');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'decline';
    applicationId: string;
    userId: string;
    initiatorName: string;
  }>({
    isOpen: false,
    type: 'approve',
    applicationId: '',
    userId: '',
    initiatorName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, dismissToast, success, error } = useToast();

  const allInitiators = [
    ...pendingApplications.map(app => ({ ...app, status: 'pending' as const })),
    ...approvedInitiators.map(app => ({ ...app, status: 'approved' as const })),
  ];

  const regions = useMemo(
    () => Array.from(new Set(peerGroups.map(g => g.region))).sort(),
    [peerGroups]
  );

  const groupsByInitiator = useMemo(
    () =>
      new Map(
        approvedInitiators.map(init => [
          init.user_id,
          peerGroups.filter(g => g.initiator_user_id === init.user_id),
        ])
      ),
    [approvedInitiators, peerGroups]
  );

  const filteredAndSorted = useMemo(() => {
    let result = [...allInitiators];

    // Apply search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        init =>
          `${init.first_name || ''} ${init.last_name || ''}`.toLowerCase().includes(lowerTerm) ||
          init.email?.toLowerCase().includes(lowerTerm)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter(init => statusFilter.includes(init.status));
    }

    // Apply region filter
    if (regionFilter.length > 0) {
      result = result.filter(init => {
        const groups = groupsByInitiator.get(init.user_id) || [];
        return groups.some(g => regionFilter.includes(g.region));
      });
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
        case 'region':
          aVal =
            groupsByInitiator.get(a.user_id)?.[0]?.region || '';
          bVal =
            groupsByInitiator.get(b.user_id)?.[0]?.region || '';
          break;
        case 'members':
          aVal = (groupsByInitiator.get(a.user_id) || []).reduce((sum, g) => sum + g.memberCount, 0);
          bVal = (groupsByInitiator.get(b.user_id) || []).reduce((sum, g) => sum + g.memberCount, 0);
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
  }, [allInitiators, searchTerm, statusFilter, regionFilter, sortColumn, sortDirection, groupsByInitiator]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (type: 'status' | 'region', value: string) => {
    if (type === 'status') {
      setStatusFilter(prev =>
        prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
      );
    } else {
      setRegionFilter(prev =>
        prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
      );
    }
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setRegionFilter([]);
    setSearchTerm('');
  };

  const hasActiveFilters = statusFilter.length > 0 || regionFilter.length > 0 || searchTerm;

  /**
   * Open confirmation dialog before approving
   */
  const handleApproveClick = (id: string, userId: string, initiatorName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'approve',
      applicationId: id,
      userId,
      initiatorName,
    });
  };

  /**
   * Open confirmation dialog before declining
   */
  const handleDeclineClick = (id: string, userId: string, initiatorName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'decline',
      applicationId: id,
      userId,
      initiatorName,
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
        await approvePeerApplication(formData);
        success(`Peer initiator "${confirmDialog.initiatorName}" approved! Peer group created.`);
      } else {
        await declinePeerApplication(formData);
        success(`Application from "${confirmDialog.initiatorName}" declined.`);
      }

      setConfirmDialog({ isOpen: false, type: 'approve', applicationId: '', userId: '', initiatorName: '' });
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
          placeholder="Search by name or email..."
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
          aria-label="Search peer initiators"
        />

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {['pending', 'approved'].map(s => (
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

        {regions.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {regions.slice(0, 3).map(r => (
              <label key={r} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={regionFilter.includes(r)}
                  onChange={() => toggleFilter('region', r)}
                  aria-label={`Filter by ${r} region`}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        )}

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

        {filteredAndSorted.filter(i => i.status === 'pending').length === 0 ? (
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
              .filter(i => i.status === 'pending')
              .map(initiator => (
                <AdminCard
                  key={initiator.id}
                  title={`${initiator.first_name || ''} ${initiator.last_name || ''}`.trim() || 'Unknown'}
                  footer={
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleApproveClick(initiator.id, initiator.user_id, `${initiator.first_name || ''} ${initiator.last_name || ''}`.trim() || 'Unknown')}
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
                        onClick={() => handleDeclineClick(initiator.id, initiator.user_id, `${initiator.first_name || ''} ${initiator.last_name || ''}`.trim() || 'Unknown')}
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
                      <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{initiator.email || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>STATUS</p>
                      <StatusIndicator type="pending" />
                    </div>
                    {initiator.application_text && (
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>MESSAGE</p>
                        <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>{initiator.application_text}</p>
                      </div>
                    )}
                  </div>
                </AdminCard>
              ))}
          </div>
        )}
      </section>

      {/* Approved Initiators */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={sectionHeading}>
            Approved Initiators ({approvedInitiators.length})
          </h2>
          <button onClick={() => handleSort('members')} style={sortButtonStyle('members')}>
            Members {sortColumn === 'members' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {filteredAndSorted.filter(i => i.status === 'approved').length === 0 ? (
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
            No approved initiators.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredAndSorted
              .filter(i => i.status === 'approved')
              .map(initiator => {
                const groups = groupsByInitiator.get(initiator.user_id) || [];
                const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0);

                return (
                  <AdminCard
                    key={initiator.id}
                    title={`${initiator.first_name || ''} ${initiator.last_name || ''}`.trim() || 'Unknown'}
                    expandable={groups.length > 0}
                    defaultExpanded={false}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>EMAIL</p>
                        <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{initiator.email || '—'}</p>
                      </div>

                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>STATUS</p>
                        <StatusIndicator type="approved" date={initiator.reviewed_at} />
                      </div>

                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>PEER GROUPS</p>
                        <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{groups.length} group{groups.length !== 1 ? 's' : ''}</p>
                      </div>

                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.25rem' }}>TOTAL MEMBERS</p>
                        <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0 }}>{totalMembers} members</p>
                      </div>

                      {groups.length > 0 && (
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', margin: '0 0 0.5rem' }}>GROUPS</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {groups.map((group, idx) => (
                              <div key={idx} style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.5rem', background: '#F9FAFB', borderRadius: '4px' }}>
                                <p style={{ fontWeight: 500, margin: '0 0 0.25rem' }}>{group.name}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                  <span>{group.region}</span>
                                  <span>{group.memberCount} members</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AdminCard>
                );
              })}
          </div>
        )}
      </section>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'approve' ? 'Approve Peer Initiator?' : 'Decline Application?'}
        message={
          confirmDialog.type === 'approve'
            ? `Approve ${confirmDialog.initiatorName} as a peer group initiator? A new peer group will be created.`
            : `Decline the application from ${confirmDialog.initiatorName}? They can apply again later.`
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
