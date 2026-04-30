import Link from 'next/link';
import { getRelatedResources } from '@/lib/internal-links';
import { createAdminClient } from '@/lib/supabase/admin';
import { RESOURCES } from '@/lib/resources-data';

interface RelatedResourcesProps {
  slug: string;
  className?: string;
}

type AccessLevel = 'free' | 'members' | 'soon';

function getAccess(
  slug: string,
  moduleStatuses: Record<string, string>,
  resources: typeof RESOURCES
): AccessLevel {
  const status = moduleStatuses[slug];
  if (status === 'live_free') return 'free';
  if (status === 'live_paid') return 'members';
  if (status === 'development') return 'soon';
  // No DB record — fall back to static gated field
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) return 'soon';
  return resource.gated ? 'members' : 'free';
}

const ACCESS_STYLES: Record<
  AccessLevel,
  { badgeLabel: string; badgeBg: string; badgeColor: string; borderColor: string }
> = {
  free: {
    badgeLabel: 'FREE',
    badgeBg: '#D1FAE5',
    badgeColor: '#059669',
    borderColor: '#059669',
  },
  members: {
    badgeLabel: 'MEMBERS',
    badgeBg: '#FEF3EC',
    badgeColor: '#E07540',
    borderColor: '#E07540',
  },
  soon: {
    badgeLabel: 'COMING SOON',
    badgeBg: '#F3F4F6',
    badgeColor: '#9CA3AF',
    borderColor: '#D1D5DB',
  },
};

export default async function RelatedResources({
  slug,
  className = '',
}: RelatedResourcesProps) {
  const relatedResources = getRelatedResources(slug);

  if (relatedResources.length === 0) {
    return null;
  }

  const admin = createAdminClient();
  const { data: statusRows } = await admin
    .from('module_status')
    .select('slug, status');

  const moduleStatuses: Record<string, string> = {};
  if (statusRows) {
    for (const row of statusRows) {
      moduleStatuses[row.slug] = row.status;
    }
  }

  return (
    <section className={`mt-12 pt-8 border-t border-gray-200 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedResources.map((resource) => {
          const access = getAccess(resource.slug, moduleStatuses, RESOURCES);
          const { badgeLabel, badgeBg, badgeColor, borderColor } = ACCESS_STYLES[access];
          const isSoon = access === 'soon';

          const cardStyle: React.CSSProperties = {
            border: `1px solid ${borderColor}`,
            borderLeft: `3px solid ${borderColor}`,
            borderRadius: 8,
            padding: '1rem',
            display: 'block',
            opacity: isSoon ? 0.65 : 1,
            transition: 'background 0.15s',
          };

          const cardContent = (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem',
                  }}
                >
                  {resource.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>{resource.reason}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    background: badgeBg,
                    color: badgeColor,
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                >
                  {badgeLabel}
                </span>
                {!isSoon && (
                  <span style={{ fontSize: '1rem', color: '#9CA3AF' }}>→</span>
                )}
              </div>
            </div>
          );

          if (isSoon) {
            return (
              <div key={resource.slug} style={cardStyle}>
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={resource.slug}
              href={`/resources/${resource.slug}`}
              style={cardStyle}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
