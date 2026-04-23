'use client';

import React, { useState } from 'react';

interface AdminCardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  expandable?: boolean;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AdminCard({
  title,
  children,
  footer,
  expandable = false,
  defaultExpanded = false,
  onExpandChange,
  className = '',
  style = {},
}: AdminCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
  };

  return (
    <div className={`ds-card ${className}`} style={style}>
      {title && (
        <div className="ds-card-header">
          <h3 className="ds-h3">{title}</h3>
          {expandable && (
            <button
              onClick={handleToggle}
              className="ds-btn-icon"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              ›
            </button>
          )}
        </div>
      )}

      {(!expandable || isExpanded) && (
        <div className="ds-card-body">{children}</div>
      )}

      {footer && !expandable && (
        <div className="ds-card-footer">{footer}</div>
      )}

      {footer && expandable && isExpanded && (
        <div className="ds-card-footer">{footer}</div>
      )}
    </div>
  );
}

export default AdminCard;
