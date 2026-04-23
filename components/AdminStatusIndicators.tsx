import React from 'react';

interface StatusProps {
  type: 'active' | 'pending' | 'approved' | 'inactive';
  date?: string;
}

export function ActiveIndicator({ date }: { date?: string }) {
  return (
    <div className="ds-status-active">
      Active
    </div>
  );
}

export function PendingIndicator() {
  return (
    <div className="ds-status-pending">
      ⏳ Pending Review
    </div>
  );
}

export function ApprovedIndicator({ date }: { date?: string }) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
      <span style={{ color: '#10B981' }}>✓ Approved</span>
      {formattedDate && (
        <span style={{ color: '#6B7280', fontSize: '11px' }}>
          ({formattedDate})
        </span>
      )}
    </div>
  );
}

export function InactiveIndicator() {
  return (
    <div className="ds-status-inactive">
      Inactive
    </div>
  );
}

export function StatusIndicator({ type, date }: StatusProps) {
  switch (type) {
    case 'active':
      return <ActiveIndicator date={date} />;
    case 'pending':
      return <PendingIndicator />;
    case 'approved':
      return <ApprovedIndicator date={date} />;
    case 'inactive':
      return <InactiveIndicator />;
    default:
      return null;
  }
}

// Pathway Badge Component
interface PathwayBadgeProps {
  pathway: 'personal' | 'team' | 'peer';
}

export function PathwayBadge({ pathway }: PathwayBadgeProps) {
  const badgeClass = {
    personal: 'ds-badge-indigo',
    team: 'ds-badge-emerald',
    peer: 'ds-badge-red',
  }[pathway];

  const icons = {
    personal: '🧑',
    team: '👥',
    peer: '🤝',
  };

  const labels = {
    personal: 'Personal',
    team: 'Team',
    peer: 'Peer',
  };

  return (
    <span className={`ds-badge ${badgeClass}`}>
      <span>{icons[pathway]}</span>
      <span>{labels[pathway]}</span>
    </span>
  );
}
