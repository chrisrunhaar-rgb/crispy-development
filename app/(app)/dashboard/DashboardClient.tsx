'use client';

import { useEffect, ReactNode } from 'react';
import { trackDashboardAccess, trackAdminAction } from '@/lib/ga-events';
import ErrorBoundary from '@/components/ErrorBoundary';

interface DashboardClientProps {
  children: ReactNode;
  pathway: string;
  viewingAsAdmin: boolean;
  viewedUserName?: string;
}

export default function DashboardClient({
  children,
  pathway,
  viewingAsAdmin,
  viewedUserName,
}: DashboardClientProps) {
  useEffect(() => {
    // Track dashboard access
    trackDashboardAccess(pathway);

    // Track admin actions
    if (viewingAsAdmin && viewedUserName) {
      trackAdminAction('admin_dashboard_access', {
        viewed_user: viewedUserName,
        pathway,
      });
    }
  }, [pathway, viewingAsAdmin, viewedUserName]);

  return (
    <ErrorBoundary componentName="Dashboard">
      {children}
    </ErrorBoundary>
  );
}
