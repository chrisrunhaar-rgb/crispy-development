'use client';

import React from 'react';
import AdminContentTable from '@/components/AdminContentTable';

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
    <section>
      <h2 style={sectionHeading}>Content Modules ({modules.length})</h2>
      <AdminContentTable modules={modules} showSearch={true} showFilters={true} />
    </section>
  );
}
