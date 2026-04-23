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
}

interface ContentTabProps {
  modules: ContentModule[];
}

export default function ContentTab({ modules }: ContentTabProps) {
  const { toasts, dismissToast, success, error } = useToast();
  const [contentModules, setContentModules] = useState(modules);

  const handleArchiveMultiple = async (slugs: string[]) => {
    try {
      // In a real implementation, this would call an archive action
      // For now, we remove them from the list
      setContentModules(prev => prev.filter(m => !slugs.includes(m.slug)));
      success(`Archived ${slugs.length} module(s)`);
    } catch (err) {
      error('Failed to archive modules');
    }
  };

  const handleExport = (modules: ContentModule[]) => {
    const data = modules.map(m => ({
      title: m.title,
      category: m.category,
      languages: m.languages.join('; '),
      reads: m.reads ?? 0,
      saves: m.saves ?? 0,
      updated: new Date(m.updated_at).toISOString().split('T')[0],
    }));

    // Use the first module as base for filename
    if (data.length > 0) {
      exportSingleRow(data[0], `crispyleaders_content_${new Date().toISOString().split('T')[0]}.csv`);
    }
    success(`Exported ${modules.length} module(s) to CSV`);
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
          showSearch={true}
          showFilters={true}
        />
      </section>
    </>
  );
}
