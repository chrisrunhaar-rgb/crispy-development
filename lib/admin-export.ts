/**
 * CSV export utilities for admin dashboard
 */

interface MemberExport {
  name: string;
  email: string;
  pathway: string;
  team?: string;
  status: string;
  'joined_date': string;
}

interface ContentExport {
  title: string;
  type: string;
  languages: string;
  created: string;
  updated: string;
  engagement: string;
}

interface TeamLeaderExport {
  'team_name': string;
  leader: string;
  size: number;
  'work_type': string;
  status: string;
}

interface PeerInitiatorExport {
  name: string;
  region: string;
  'peer_groups': string;
  status: string;
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCSV(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV<T extends Record<string, any>>(data: T[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(escapeCSV).join(',');

  const dataRows = data.map((row) =>
    headers.map((header) => escapeCSV(row[header])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Trigger browser download of CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for CSV
 */
function formatDateForExport(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return dateString;
  }
}

/**
 * Export members as CSV
 */
export function exportMembers(members: Array<{
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    pathway?: string;
    team?: string;
  };
  created_at?: string;
}>): void {
  const data: MemberExport[] = members.map((member) => ({
    name: `${member.user_metadata?.first_name || ''} ${member.user_metadata?.last_name || ''}`.trim(),
    email: member.email || '',
    pathway: member.user_metadata?.pathway || 'member',
    team: member.user_metadata?.team || '',
    status: 'active',
    'joined_date': formatDateForExport(member.created_at || new Date().toISOString()),
  }));

  const csv = arrayToCSV(data);
  const filename = `crispyleaders_members_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export content modules as CSV
 */
export function exportContent(modules: Array<{
  slug: string;
  title: string;
  created: string;
  updated: string;
  languages: string[];
  engagement?: { saves?: number; reads?: number };
}>): void {
  const data: ContentExport[] = modules.map((module) => ({
    title: module.title,
    type: 'Module',
    languages: module.languages.join('; '),
    created: formatDateForExport(module.created),
    updated: formatDateForExport(module.updated),
    engagement: `${module.engagement?.saves || 0} saves, ${module.engagement?.reads || 0} reads`,
  }));

  const csv = arrayToCSV(data);
  const filename = `crispyleaders_content_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export team leaders as CSV
 */
export function exportTeamLeaders(leaders: Array<{
  id: string;
  first_name?: string;
  last_name?: string;
  team_name?: string;
  member_count?: number;
  status: string;
}>): void {
  const data: TeamLeaderExport[] = leaders.map((leader) => ({
    'team_name': leader.team_name || 'Unnamed Team',
    leader: `${leader.first_name || ''} ${leader.last_name || ''}`.trim(),
    size: leader.member_count || 0,
    'work_type': 'Team',
    status: leader.status,
  }));

  const csv = arrayToCSV(data);
  const filename = `crispyleaders_teamleaders_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export peer initiators as CSV
 */
export function exportPeerInitiators(initiators: Array<{
  id: string;
  first_name?: string;
  last_name?: string;
  region?: string;
  peer_group_count?: number;
  status: string;
}>): void {
  const data: PeerInitiatorExport[] = initiators.map((initiator) => ({
    name: `${initiator.first_name || ''} ${initiator.last_name || ''}`.trim(),
    region: initiator.region || 'Global',
    'peer_groups': String(initiator.peer_group_count || 0),
    status: initiator.status,
  }));

  const csv = arrayToCSV(data);
  const filename = `crispyleaders_peerinitiators_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export single row as CSV
 */
export function exportSingleRow<T extends Record<string, any>>(row: T, filename: string): void {
  const csv = arrayToCSV([row]);
  downloadCSV(csv, filename);
}

/**
 * Export members with simple transformation for bulk export
 */
export function exportMembersAsCSV(members: Array<{
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  pathway?: string;
  created_at?: string;
}>): void {
  const data = members.map((member) => ({
    name: `${member.first_name || ''} ${member.last_name || ''}`.trim(),
    email: member.email || '',
    pathway: member.pathway || 'personal',
    'joined_date': formatDateForExport(member.created_at || new Date().toISOString()),
  }));

  const csv = arrayToCSV(data);
  const filename = `crispyleaders_members_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}
