import React from 'react';

interface Member {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  status: 'active' | 'inactive' | 'pending';
  pathway?: 'personal' | 'team' | 'peer';
  completedModules?: number;
}

interface AdminMembersTableProps {
  members: Member[];
  onEdit?: (memberId: string) => void;
  onDelete?: (memberId: string) => void;
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

export default function AdminMembersTable({
  members,
  onEdit,
  onDelete,
}: AdminMembersTableProps) {
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
          Members will appear here when they join
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="ds-table">
        <thead className="ds-table-header">
          <tr>
            <th style={{ width: '25%' }}>Name</th>
            <th style={{ width: '25%' }}>Email</th>
            <th style={{ width: '15%' }}>Pathway</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '10%' }}>Progress</th>
            <th style={{ width: '10%' }} aria-label="Actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="ds-table-body">
          {members.map((member) => {
            const name =
              member.first_name || member.last_name
                ? `${member.first_name || ''} ${member.last_name || ''}`.trim()
                : member.email;
            const initials = getInitials(member.first_name, member.last_name, member.email);
            const avatarBg = getAvatarColor(member.id);

            return (
              <tr key={member.id}>
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
                    <span style={{ fontWeight: '500', color: '#1F2937' }}>
                      {name}
                    </span>
                  </div>
                </td>
                <td data-label="Email">{member.email}</td>
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
                <td data-label="Status">
                  {getStatusBadge(member.status)}
                </td>
                <td data-label="Progress" style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: '500', color: '#1F2937' }}>
                    {member.completedModules || 0}
                  </span>
                </td>
                <td data-label="Actions" style={{ textAlign: 'center' }}>
                  <button
                    className="ds-btn-icon"
                    onClick={() => onEdit?.(member.id)}
                    title="View profile"
                    aria-label={`View profile for ${name}`}
                  >
                    👁️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
