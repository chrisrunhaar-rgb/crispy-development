export type ContentBlock =
  | { type: "h3"; text: string }
  | { type: "body"; text: string; lead?: boolean }
  | { type: "bullet"; text: string; bold?: string }
  | { type: "screenshot"; description: string; imageUrl?: string }
  | { type: "tip"; text: string }
  | { type: "note"; text: string }
  | { type: "warning"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "url"; url: string; label?: string };

export interface PartSection {
  id: string;
  title: string;
  procedural?: boolean; // renders bullets as numbered steps
  blocks: ContentBlock[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  type: "understood" | "implemented";
}

export interface TrainingPart {
  number: number;
  title: string;
  subtitle: string;
  whatYouWillLearn: string[];
  sections: PartSection[];
  endChecklist: ChecklistItem[];
}
