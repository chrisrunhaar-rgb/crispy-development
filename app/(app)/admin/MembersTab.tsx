'use client';

import React, { useState } from 'react';
import AdminMembersTable from '@/components/AdminMembersTable';
import AdminBroadcastForm from './AdminBroadcastForm';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { exportMembersAsCSV } from '@/lib/admin-export';
import { adminBulkDeleteMembers, updateMemberCoachAccess, updateMemberSubscription } from './actions';

const ASSESSMENT_KEYS = [
  'disc_completed_at',
  'thinking_style_completed_at',
  'wheel_of_life_saved_at',
  'karunia_completed_at',
  'fivela_completed_at',
  'enneagram_completed_at',
  'big_five_completed_at',
  'personalities16_completed_at',
];

interface UserData {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: Record<string, unknown>;
}

interface Member {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  status: 'active' | 'inactive' | 'pending';
  pathway?: 'free' | 'personal' | 'team' | 'peer';
  completedModules?: number;
  moduleTitles?: string[];
  team?: boolean;
  peer?: boolean;
  tests?: number;
  timezone?: string | null;
  coach_access?: boolean;
  coach_minutes_granted?: number;
}

interface MembersTabProps {
  users: UserData[];
  moduleData: Map<string, { count: number; titles: string[] }>;
  membersList: Array<{ id: string; name: string; email: string }>;
  coachData: Map<string, { coach_access: boolean; coach_minutes_granted: number; subscription_active: boolean }>;
  teamSeatsMap: Map<string, { filled: number; max: number }>;
}

export default function MembersTab({
  users,
  moduleData,
  membersList,
  coachData,
  teamSeatsMap,
}: MembersTabProps) {
  const { toasts, dismissToast, success, error } = useToast();
  const [tableMembers, setTableMembers] = useState<Member[]>(() => {
    return users.map(u => {
      const firstName = u.user_metadata?.first_name as string ?? '';
      const lastName = u.user_metadata?.last_name as string ?? '';
      const pathway = u.user_metadata?.pathway as string ?? 'personal';
      const testsDone = ASSESSMENT_KEYS.filter(k => !!u.user_metadata?.[k]).length;

      const cd = coachData.get(u.id);
      const seats = teamSeatsMap.get(u.id);
      const teamSeats = seats ? `${seats.filled}/${seats.max}` : null;
      return {
        id: u.id,
        email: u.email ?? '',
        first_name: firstName,
        last_name: lastName,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        status: 'active' as const,
        pathway: pathway as 'free' | 'personal' | 'team' | 'peer',
        completedModules: moduleData.get(u.id)?.count ?? 0,
        moduleTitles: moduleData.get(u.id)?.titles ?? [],
        teamSeats,
        tests: testsDone,
        timezone: u.user_metadata?.timezone as string | null ?? null,
        coach_access: cd?.coach_access ?? false,
        coach_minutes_granted: cd?.coach_minutes_granted ?? 120,
        subscription_active: cd?.subscription_active ?? false,
      };
    });
  });

  const handleDeleteMultiple = async (memberIds: string[]) => {
    try {
      const result = await adminBulkDeleteMembers(memberIds);
      if (result.success) {
        setTableMembers(prev => prev.filter(m => !memberIds.includes(m.id)));
        success(`Deleted ${result.deletedCount ?? memberIds.length} member(s)`);
      } else {
        error(result.error ?? 'Failed to delete members');
      }
    } catch (err) {
      error('An error occurred while deleting members');
    }
  };

  const handleExport = (members: Member[]) => {
    exportMembersAsCSV(members);
    success(`Exported ${members.length} member(s) to CSV`);
  };

  const handleCoachAccessChange = async (memberId: string, access: boolean, minutes: number) => {
    const result = await updateMemberCoachAccess(memberId, access, minutes);
    if (result.error) {
      error(result.error);
    } else {
      setTableMembers(prev =>
        prev.map(m => m.id === memberId ? { ...m, coach_access: access, coach_minutes_granted: minutes } : m)
      );
    }
  };

  const handleSubscriptionChange = async (memberId: string, subscriptionActive: boolean, pathway: string) => {
    const result = await updateMemberSubscription(memberId, subscriptionActive, pathway);
    if (result.error) {
      error(result.error);
    } else {
      setTableMembers(prev =>
        prev.map(m => m.id === memberId ? { ...m, subscription_active: subscriptionActive, pathway: pathway as 'free' | 'personal' | 'team' | 'peer' } : m)
      );
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
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <section>
        <h2 style={sectionHeading}>All Members ({tableMembers.length})</h2>
        <AdminMembersTable
          members={tableMembers}
          onDeleteMultiple={handleDeleteMultiple}
          onExport={handleExport}
          onCoachAccessChange={handleCoachAccessChange}
          onSubscriptionChange={handleSubscriptionChange}
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
