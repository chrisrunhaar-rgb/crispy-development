/**
 * Google Analytics 4 Custom Events
 *
 * Track user behavior across the platform
 * Events are automatically sent to GA4 via gtag
 */

export type AssessmentType =
  | 'disc' | 'wheel-of-life' | 'three-thinking-styles' | 'karunia-rohani'
  | 'enneagram' | 'myers-briggs' | 'big-five' | '16-personalities'
  | 'thinking-style' | 'comm-style' | 'trust' | 'contribution-zone'
  | 'conflict-style';

export type ResourceCategory =
  | 'assessments' | 'cross-cultural-leadership' | 'thinking-decisions'
  | 'leadership' | 'personal-growth' | 'training';

// Track assessment completion
export function trackAssessmentCompletion(assessmentType: AssessmentType) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'assessment_completed', {
    assessment_type: assessmentType,
    timestamp: new Date().toISOString(),
  });
}

// Track assessment result viewed
export function trackAssessmentResultViewed(assessmentType: AssessmentType) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'assessment_result_viewed', {
    assessment_type: assessmentType,
    timestamp: new Date().toISOString(),
  });
}

// Track resource viewed
export function trackResourceViewed(resourceSlug: string, category: ResourceCategory) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'resource_viewed', {
    resource: resourceSlug,
    category: category,
    timestamp: new Date().toISOString(),
  });
}

// Track resource saved/bookmarked
export function trackResourceSaved(resourceSlug: string, isSaved: boolean) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'resource_saved', {
    resource: resourceSlug,
    saved: isSaved,
    timestamp: new Date().toISOString(),
  });
}

// Track dashboard accessed
export function trackDashboardAccess(pathway: string | null) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'dashboard_accessed', {
    pathway: pathway || 'personal',
    timestamp: new Date().toISOString(),
  });
}

// Track team/peer group access
export function trackTeamAccess(groupType: 'team' | 'peer') {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'group_accessed', {
    group_type: groupType,
    timestamp: new Date().toISOString(),
  });
}

// Track admin action
export function trackAdminAction(action: string, details?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'admin_action', {
    action: action,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

// Track signup (from auth)
export function trackSignup(pathway: string) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'sign_up', {
    method: 'email',
    pathway: pathway,
    timestamp: new Date().toISOString(),
  });
}

// Track login
export function trackLogin() {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'login', {
    method: 'email',
    timestamp: new Date().toISOString(),
  });
}

// Track page scroll depth
export function trackScrollDepth(depth: 'low' | 'medium' | 'high') {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'scroll_depth', {
    depth: depth,
    timestamp: new Date().toISOString(),
  });
}

// Track form submission
export function trackFormSubmission(formName: string, success: boolean) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'form_submit', {
    form: formName,
    success: success,
    timestamp: new Date().toISOString(),
  });
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
