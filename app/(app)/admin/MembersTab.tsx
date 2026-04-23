'use client';

import React from 'react';
import AdminMembersTable from '@/components/AdminMembersTable';
import AdminBroadcastForm from './AdminBroadcastForm';

const ASSESSMENT_KEYS = [
  'disc_completed_at',
  'thinking_style_completed_at',
  'wheel_of_life_saved_at',
  'karunia_completed_at',
];

interface UserData {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: Record<string, unknown>;
}

interface MembersTabProps {
  users: UserData[];
  progressCounts: Map<string, number>;
  membersList: Array<{ id: string; name: string; email: string }>;
}

export default function MembersTab({
  users,
  progressCounts,
  membersList,
}: MembersTabProps) {
  // Transform users to table format
  const tableMembers = users.map(u => {
    const firstName = u.user_metadata?.first_name as string ?? '';
    const lastName = u.user_metadata?.last_name as string ?? '';
    const pathway = u.user_metadata?.pathway as string ?? 'personal';
    const hasTeam = pathway === 'team' || !!u.user_metadata?.team_id;
    const hasPeer = pathway === 'peer' || !!u.user_metadata?.peer_group_id;
    const testsDone = ASSESSMENT_KEYS.filter(k => !!u.user_metadata?.[k]).length;

    return {
      id: u.id,
      email: u.email ?? '',
      first_name: firstName,
      last_name: lastName,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      status: 'active' as const,
      pathway: pathway as 'personal' | 'team' | 'peer',
      completedModules: progressCounts.get(u.id) ?? 0,
      team: hasTeam,
      peer: hasPeer,
      tests: testsDone,
      timezone: u.user_metadata?.timezone as string | null ?? null,
    };
  });

  const sectionHeading: React.CSSProperties = {
    fontFamily: 'var(--font-montserrat)',
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'oklch(52% 0.008 260)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      <section>
        <h2 style={sectionHeading}>All Members ({tableMembers.length})</h2>
        <AdminMembersTable
          members={tableMembers}
          showSearch={true}
          showFilters={true}
          testCount={ASSESSMENT_KEYS.length}
        />
      </section>

      <section>
        <h2 style={sectionHeading}>Send Notification</h2>
        <AdminBroadcastForm members={membersList} />
      </section>
    </>
  );
}
