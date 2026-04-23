'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface NavItem {
  key: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'members', label: 'Members', icon: '👥' },
  { key: 'leaders', label: 'Team Leaders', icon: '🎯' },
  { key: 'peers', label: 'Peer Initiators', icon: '🤝' },
  { key: 'content', label: 'Content', icon: '📚' },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'members') as string;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="ds-btn-icon fixed top-4 left-4 z-50 md:hidden"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Sidebar overlay (mobile) */}
      {isMobileOpen && (
        <div
          className="ds-sidebar-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`ds-sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="ds-sidebar-header">
          <div className="ds-sidebar-logo">Crispy</div>
          <button
            onClick={toggleCollapse}
            className="ds-sidebar-toggle"
            aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="ds-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/admin?tab=${item.key}`}
              className={`ds-nav-item ${activeTab === item.key ? 'active' : ''}`}
              data-label={item.label}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={activeTab === item.key ? 'page' : undefined}
            >
              <span className="ds-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="ds-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
