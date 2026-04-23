import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    accent?: boolean;
  }>;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  stats,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="ds-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: stats ? '24px' : '0' }}>
        <div>
          {subtitle && <p className="ds-label" style={{ marginBottom: '8px' }}>{subtitle}</p>}
          <h1 className="ds-h1">{title}</h1>
        </div>
        {actions && <div style={{ display: 'flex', gap: '12px' }}>{actions}</div>}
      </div>

      {stats && stats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px' }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p className="ds-label" style={{ color: '#6B7280' }}>
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: stat.accent ? '#818CF8' : '#1F2937',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPageHeader;
