'use client';

import Link from 'next/link';
import { getRelatedResources } from '@/lib/internal-links';
import { ArrowRight } from 'lucide-react';

interface RelatedResourcesProps {
  slug: string;
  className?: string;
}

export default function RelatedResources({ slug, className = '' }: RelatedResourcesProps) {
  const relatedResources = getRelatedResources(slug);

  if (relatedResources.length === 0) {
    return null;
  }

  return (
    <section className={`mt-12 pt-8 border-t border-gray-200 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedResources.map((resource) => (
          <Link
            key={resource.slug}
            href={`/resources/${resource.slug}`}
            className="group p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600">{resource.reason}</p>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
