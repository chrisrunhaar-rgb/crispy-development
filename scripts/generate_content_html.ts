/**
 * Converts ZOOM_PARTS and TEAMS_PARTS TypeScript data → HTML and PATCHes content_html in Supabase.
 * Run: npx tsx scripts/generate_content_html.ts
 */
import { ZOOM_PARTS } from "../lib/zoom-training-data";
import { TEAMS_PARTS } from "../lib/teams-training-data";
import type { TrainingPart, PartSection, ContentBlock } from "../components/Training/types";

const SUPABASE_URL = "https://miegjduhwekszuaestzh.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZWdqZHVod2Vrc3p1YWVzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU2MDgxOCwiZXhwIjoyMDkyMTM2ODE4fQ.5XBGwjaA-AaMWSa4KWxLD--pNcWzD-SWk_OkSCnPgKY";

const HEADERS = {
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  apikey: SERVICE_ROLE_KEY,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

// Supabase chapter IDs (order_index = TypeScript part.number)
const ZOOM_CHAPTER_IDS: Record<number, string> = {
  1: "e98adaa8-5fd6-440c-87ef-51b96ff86d34",
  2: "5c9ba79f-ec27-49fd-9391-206e6a247f98",
  3: "9cc56d1f-758f-48f8-9ef1-2e34f0b469c7",
  4: "783964af-d058-481b-bda5-679d7bd39746",
  5: "feecf535-e83a-4397-9e71-a720a567981c",
  6: "5ddc1921-1ec1-4802-a1ac-40dc66809c0b",
  7: "27430f29-32a5-44b4-9e31-b8fd02ce7087",
  8: "e7ead956-fdd4-45c0-befa-50c413364db0",
  9: "92de904b-eb79-47fb-83f4-527108b485af",
  10: "ab5399d5-70cc-4d0d-9ba3-d8ee161da782",
  11: "6e72847b-29b1-46a9-bb4f-8def8bf72cc4",
};

const TEAMS_CHAPTER_IDS: Record<number, string> = {
  1: "fef8005c-d60f-492b-85cb-4372dc872acd",
  2: "4a98bc42-99cd-4180-8856-46170b4547cf",
  3: "039285c0-65aa-4366-ba1d-14eb9bf99cb7",
  4: "0a29c953-30dd-4215-9ed4-3466b21710b2",
  5: "2be37b09-b931-4f58-81bb-8893c5a4bcb0",
  6: "ab790995-a4cf-45bd-8e3e-cb540369d52e",
  7: "6624a533-80ab-40b8-bfc5-354a7c0213b3",
  8: "b68c0108-94f2-4a19-b39c-a4c0009f9608",
  9: "fc7f9c08-37e5-4b87-acb9-411b4cee7ba3",
  10: "3646345f-11df-4519-82e1-3538c7f91369",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blockToHtml(block: ContentBlock): string {
  switch (block.type) {
    case "body":
      return block.lead
        ? `<p><strong>${esc(block.text)}</strong></p>\n`
        : `<p>${esc(block.text)}</p>\n`;

    case "h3":
      return `<h4>${esc(block.text)}</h4>\n`;

    case "tip":
      return `<div class="tip"><span class="label">💡 Tip</span>${esc(block.text)}</div>\n`;

    case "note":
      return `<div class="note"><span class="label">ℹ️ Note</span>${esc(block.text)}</div>\n`;

    case "warning":
      return `<div class="warning"><span class="label">⚠️ Important</span>${esc(block.text)}</div>\n`;

    case "screenshot":
      if (block.imageUrl) {
        return (
          `<figure class="chapter-screenshot">\n` +
          `  <img src="${esc(block.imageUrl)}" alt="${esc(block.description)}" loading="lazy" />\n` +
          `  <figcaption>${esc(block.description)}</figcaption>\n` +
          `</figure>\n`
        );
      }
      return `<div class="note"><span class="label">📸 Screenshot</span>${esc(block.description)}</div>\n`;

    case "url":
      return (
        `<div class="note"><span class="label">🔗 Link</span>` +
        `<a href="${esc(block.url)}" target="_blank" rel="noopener noreferrer">${esc(block.label ?? block.url)}</a>` +
        `</div>\n`
      );

    case "table": {
      let t = `<table>\n<tr>`;
      for (const h of block.headers) t += `<th>${esc(h)}</th>`;
      t += `</tr>\n`;
      for (const row of block.rows) {
        t += `<tr>`;
        for (const cell of row) t += `<td>${esc(cell)}</td>`;
        t += `</tr>\n`;
      }
      t += `</table>\n`;
      return t;
    }

    default:
      return "";
  }
}

function sectionToHtml(section: PartSection): string {
  let html = `<h3>${esc(section.title)}</h3>\n`;

  let inList = false;
  let listType: "ol" | "ul" | null = null;

  const closeList = () => {
    if (inList && listType) {
      html += `</${listType}>\n`;
      inList = false;
      listType = null;
    }
  };

  for (const block of section.blocks) {
    if (block.type === "bullet") {
      const wantedType = section.procedural ? "ol" : "ul";
      if (!inList || listType !== wantedType) {
        closeList();
        listType = wantedType;
        html += `<${listType}>\n`;
        inList = true;
      }
      if ("bold" in block && block.bold) {
        const rest = block.text.startsWith(block.bold)
          ? block.text.slice(block.bold.length)
          : ` — ${block.text}`;
        html += `<li><strong>${esc(block.bold)}</strong>${esc(rest)}</li>\n`;
      } else {
        html += `<li>${esc(block.text)}</li>\n`;
      }
    } else {
      closeList();
      html += blockToHtml(block);
    }
  }

  closeList();
  return html;
}

function partToHtml(part: TrainingPart): string {
  // What you'll learn
  let html =
    `<h4>What You Will Learn</h4>\n<ul>\n` +
    part.whatYouWillLearn.map((item) => `  <li>${esc(item)}</li>`).join("\n") +
    `\n</ul>\n\n`;

  // Sections
  for (const section of part.sections) {
    html += sectionToHtml(section) + "\n";
  }

  return html.trim();
}

async function patchChapter(id: string, contentHtml: string): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/course_chapters?id=eq.${id}`;
  const resp = await fetch(url, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({ content_html: contentHtml }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`PATCH ${id} → HTTP ${resp.status}: ${body}`);
  }
}

async function main() {
  console.log("Generating HTML from TypeScript data...");

  const jobs: Array<{ label: string; id: string; part: TrainingPart }> = [
    ...ZOOM_PARTS.map((p) => ({
      label: `Zoom Part ${p.number}: ${p.title}`,
      id: ZOOM_CHAPTER_IDS[p.number],
      part: p,
    })),
    ...TEAMS_PARTS.map((p) => ({
      label: `Teams Part ${p.number}: ${p.title}`,
      id: TEAMS_CHAPTER_IDS[p.number],
      part: p,
    })),
  ];

  for (const { label, id, part } of jobs) {
    const html = partToHtml(part);
    await patchChapter(id, html);
    console.log(`  ✓ ${label}`);
  }

  console.log(`\nDone — ${jobs.length} chapters updated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
