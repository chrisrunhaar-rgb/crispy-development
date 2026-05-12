"""
Seed courses and course_chapters (EN + ID) from HTML source files.
Run: uv run --python 3.12 python scripts/seed_courses.py
"""
import json
import re
import urllib.request
from pathlib import Path

SUPABASE_URL = "https://miegjduhwekszuaestzh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZWdqZHVod2Vrc3p1YWVzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU2MDgxOCwiZXhwIjoyMDkyMTM2ODE4fQ.5XBGwjaA-AaMWSa4KWxLD--pNcWzD-SWk_OkSCnPgKY"
HTML_EN = Path(r"C:\Users\user\Documents\CRISPY\_Documents\Zoom-Teams-Training-Translation-EN.html")
HTML_ID = Path(r"C:\Users\user\Documents\CRISPY\_Documents\Zoom-Teams-Training-Translation-EN id.html")

HEADERS = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "apikey": SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def rest_post(table: str, data, upsert_on: str | None = None) -> list:
    headers = dict(HEADERS)
    if upsert_on:
        headers["Prefer"] = "resolution=merge-duplicates,return=representation"
        url = f"{SUPABASE_URL}/rest/v1/{table}?on_conflict={upsert_on}"
    else:
        url = f"{SUPABASE_URL}/rest/v1/{table}"
    payload = json.dumps(data if isinstance(data, list) else [data]).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {body}") from e


def rest_patch(table: str, filters: str, data: dict) -> None:
    url = f"{SUPABASE_URL}/rest/v1/{table}?{filters}"
    headers = {**HEADERS, "Prefer": "return=minimal"}
    payload = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=headers, method="PATCH")
    try:
        with urllib.request.urlopen(req) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"PATCH HTTP {e.code}: {body}") from e


def rest_get(table: str, select: str = "*", filters: str = "") -> list:
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    if filters:
        url += f"&{filters}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text.strip())
    return text


def parse_chapters(html: str, part_prefix: str = "Part"):
    """Split HTML by <h2> tags and extract chapters. part_prefix: 'Part' (EN) or 'Bagian' (ID)."""
    parts = re.split(r"(?=<h2[^>]*>)", html)
    chapters = []
    for part in parts:
        h2_match = re.match(r"<h2[^>]*>(.*?)</h2>", part, re.DOTALL)
        if not h2_match:
            continue
        title_raw = re.sub(r"<[^>]+>", "", h2_match.group(1)).strip()
        if not title_raw.startswith(part_prefix):
            continue

        subtitle_match = re.search(r'<p class="subtitle">(.*?)</p>', part, re.DOTALL)
        subtitle = subtitle_match.group(1).strip() if subtitle_match else None

        content_start = subtitle_match.end() if subtitle_match else h2_match.end()
        content_html = part[content_start:].strip()
        content_html = re.sub(r'<hr[^>]*>.*$', '', content_html, flags=re.DOTALL).strip()

        chapters.append({"title": title_raw, "subtitle": subtitle, "content_html": content_html})
    return chapters


def split_courses(html: str, teams_marker: str) -> tuple[str, str]:
    idx = html.find(teams_marker)
    return html[:idx], html[idx:]


def main():
    # ── EN content ──
    en_html = HTML_EN.read_text(encoding="utf-8")
    zoom_en, teams_en = split_courses(en_html, '<div class="course-header">\n  <h1>Microsoft Teams')
    zoom_chapters_en = parse_chapters(zoom_en, "Part")
    teams_chapters_en = parse_chapters(teams_en, "Part")
    assert len(zoom_chapters_en) == 11, f"Expected 11 Zoom EN chapters, got {len(zoom_chapters_en)}"
    assert len(teams_chapters_en) == 10, f"Expected 10 Teams EN chapters, got {len(teams_chapters_en)}"
    print(f"EN — Zoom: {len(zoom_chapters_en)}, Teams: {len(teams_chapters_en)}")

    # ── ID content ──
    id_html = HTML_ID.read_text(encoding="utf-8")
    zoom_id, teams_id = split_courses(id_html, '<div class="course-header">\n  <h1>Pelatihan Microsoft Teams')
    zoom_chapters_id = parse_chapters(zoom_id, "Bagian")
    teams_chapters_id = parse_chapters(teams_id, "Bagian")
    assert len(zoom_chapters_id) == 11, f"Expected 11 Zoom ID chapters, got {len(zoom_chapters_id)}"
    assert len(teams_chapters_id) == 10, f"Expected 10 Teams ID chapters, got {len(teams_chapters_id)}"
    print(f"ID — Zoom: {len(zoom_chapters_id)}, Teams: {len(teams_chapters_id)}")

    # ── Upsert courses ──
    print("Upserting courses...")
    result = rest_post("courses", [
        {
            "slug": "zoom-training",
            "title": "Zoom Training",
            "description": "Master Zoom for professional remote meetings and cross-cultural team collaboration. 11 practical parts, from setup to advanced features.",
            "is_free": True,
            "order_index": 1,
        },
        {
            "slug": "microsoft-teams",
            "title": "Microsoft Teams",
            "description": "Get confident with Teams — from setup to leading effective meetings, managing files, and staying on top of conversations across your team.",
            "is_free": True,
            "order_index": 2,
        },
    ], upsert_on="slug")
    course_ids = {r["slug"]: r["id"] for r in result}
    print(f"  {list(course_ids.keys())}")

    # ── Upsert EN chapters + ID content ──
    def upsert_chapters(course_slug: str, en_chapters: list, id_chapters: list):
        course_id = course_ids[course_slug]
        total = len(en_chapters)
        for i, (en, id_ch) in enumerate(zip(en_chapters, id_chapters), start=1):
            slug = slugify(en["title"])
            rest_post(
                "course_chapters",
                {
                    "course_id": course_id,
                    "slug": slug,
                    "title": en["title"],
                    "subtitle": en["subtitle"],
                    "order_index": i,
                    "content_html": en["content_html"],
                    "content_html_id": id_ch["content_html"],
                },
                upsert_on="course_id,slug",
            )
            print(f"  {i}/{total} — {en['title']}")

    print("Upserting Zoom chapters (EN + ID)...")
    upsert_chapters("zoom-training", zoom_chapters_en, zoom_chapters_id)

    print("Upserting Teams chapters (EN + ID)...")
    upsert_chapters("microsoft-teams", teams_chapters_en, teams_chapters_id)

    # ── Verify ──
    rows = rest_get("courses", select="title,course_chapters(count)")
    print("\nVerification:")
    for r in rows:
        print(f"  {r['title']}: {r.get('course_chapters', [{}])[0].get('count', '?')} chapters")

    # Check ID content populated
    sample = rest_get("course_chapters", select="slug,content_html_id", filters="order=order_index&limit=2")
    for s in sample:
        has_id = bool(s.get("content_html_id"))
        print(f"  {s['slug']}: content_html_id={'OK' if has_id else 'MISSING'}")
    print("Done.")


if __name__ == "__main__":
    main()
