'use client';

import React, { useState } from 'react';
import AdminContentTable from '@/components/AdminContentTable';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { exportSingleRow } from '@/lib/admin-export';

interface ContentModule {
  slug: string;
  title: string;
  category: string;
  created_at: string;
  updated_at: string;
  languages: string[];
  reads?: number;
  saves?: number;
  status?: string;
}

interface ContentTabProps {
  modules: ContentModule[];
  moduleStatuses?: Record<string, string>;
}

export default function ContentTab({ modules, moduleStatuses = {} }: ContentTabProps) {
  const { toasts, dismissToast, success, error } = useToast();
  const [statuses, setStatuses] = useState<Record<string, string>>(moduleStatuses);

  const contentModules = modules.map(m => ({ ...m, status: statuses[m.slug] ?? 'development' }));

  const handleArchiveMultiple = async (slugs: string[]) => {
    try {
      success(`Archived ${slugs.length} module(s)`);
    } catch {
      error('Failed to archive modules');
    }
  };

  const handleExport = (mods: ContentModule[]) => {
    const data = mods.map(m => ({
      title: m.title,
      category: m.category,
      status: m.status ?? 'development',
      languages: m.languages.join('; '),
      reads: m.reads ?? 0,
      saves: m.saves ?? 0,
      updated: new Date(m.updated_at).toISOString().split('T')[0],
    }));
    if (data.length > 0) {
      exportSingleRow(data[0], `crispyleaders_content_${new Date().toISOString().split('T')[0]}.csv`);
    }
    success(`Exported ${mods.length} module(s) to CSV`);
  };

  const handleStatusChange = async (slug: string, status: string) => {
    const prev = statuses[slug];
    setStatuses(s => ({ ...s, [slug]: status }));
    try {
      const res = await fetch('/api/admin/module-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status }),
      });
      if (!res.ok) throw new Error('Failed');
      success(`${slug}: ${status}`);
    } catch {
      setStatuses(s => ({ ...s, [slug]: prev ?? 'development' }));
      error(`Failed to update ${slug}`);
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

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <section>
        <h2 style={sectionHeading}>Content Modules ({contentModules.length})</h2>
        <AdminContentTable
          modules={contentModules}
          onArchiveMultiple={handleArchiveMultiple}
          onExport={handleExport}
          onStatusChange={handleStatusChange}
          showSearch={true}
          showFilters={true}
        />
      </section>
    </>
  );
}
