"""
Seed courses and course_chapters from HTML source file.
Run: uv run --python 3.12 python scripts/seed_courses.py
"""
import json
import re
import urllib.request
from pathlib import Path

SUPABASE_URL = "https://miegjduhwekszuaestzh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZWdqZHVod2Vrc3p1YWVzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU2MDgxOCwiZXhwIjoyMDkyMTM2ODE4fQ.5XBGwjaA-AaMWSa4KWxLD--pNcWzD-SWk_OkSCnPgKY"
HTML_FILE = Path(r"C:\Users\user\Documents\CRISPY\_Documents\Zoom-Teams-Training-Translation-EN.html")

HEADERS = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "apikey": SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def rest_post(table: str, data, upsert_on: str | None = None) -> list:
    headers = dict(HEADERS)
    if upsert_on:
        headers["Prefer"] = f"resolution=merge-duplicates,return=representation"
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


def rest_get(table: str, select: str = "*", filters: str = "") -> list:
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    if filters:
        url += f"&{filters}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def rest_delete(table: str, filters: str) -> None:
    url = f"{SUPABASE_URL}/rest/v1/{table}?{filters}"
    req = urllib.request.Request(url, headers=HEADERS, method="DELETE")
    try:
        with urllib.request.urlopen(req) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {body}") from e


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text.strip())
    return text


def parse_chapters(html: str):
    """Split HTML by <h2> tags and extract chapters."""
    parts = re.split(r"(?=<h2[^>]*>)", html)
    chapters = []
    for part in parts:
        h2_match = re.match(r"<h2[^>]*>(.*?)</h2>", part, re.DOTALL)
        if not h2_match:
            continue
        title = re.sub(r"<[^>]+>", "", h2_match.group(1)).strip()
        if not title.startswith("Part"):
            continue

        subtitle_match = re.search(r'<p class="subtitle">(.*?)</p>', part, re.DOTALL)
        subtitle = subtitle_match.group(1).strip() if subtitle_match else None

        if subtitle_match:
            content_start = subtitle_match.end()
        else:
            content_start = h2_match.end()
        content_html = part[content_start:].strip()
        content_html = re.sub(r'<hr[^>]*>.*$', '', content_html, flags=re.DOTALL).strip()

        chapters.append({"title": title, "subtitle": subtitle, "content_html": content_html})
    return chapters


def main():
    html = HTML_FILE.read_text(encoding="utf-8")

    teams_header_idx = html.find('<div class="course-header">\n  <h1>Microsoft Teams')
    zoom_html = html[:teams_header_idx]
    teams_html = html[teams_header_idx:]

    zoom_chapters = parse_chapters(zoom_html)
    teams_chapters = parse_chapters(teams_html)

    print(f"Zoom chapters: {len(zoom_chapters)}")
    print(f"Teams chapters: {len(teams_chapters)}")
    assert len(zoom_chapters) == 11
    assert len(teams_chapters) == 10

    # Upsert courses
    print("Upserting courses...")
    courses_data = [
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
    ]
    result = rest_post("courses", courses_data, upsert_on="slug")
    course_ids = {r["slug"]: r["id"] for r in result}
    print(f"  courses: {list(course_ids.keys())}")

    # Upsert Zoom chapters
    print("Upserting Zoom chapters...")
    for i, ch in enumerate(zoom_chapters, start=1):
        slug = slugify(ch["title"])
        rest_post(
            "course_chapters",
            {
                "course_id": course_ids["zoom-training"],
                "slug": slug,
                "title": ch["title"],
                "subtitle": ch["subtitle"],
                "order_index": i,
                "content_html": ch["content_html"],
            },
            upsert_on="course_id,slug",
        )
        print(f"  {i}/11 — {ch['title']}")

    # Upsert Teams chapters
    print("Upserting Teams chapters...")
    for i, ch in enumerate(teams_chapters, start=1):
        slug = slugify(ch["title"])
        rest_post(
            "course_chapters",
            {
                "course_id": course_ids["microsoft-teams"],
                "slug": slug,
                "title": ch["title"],
                "subtitle": ch["subtitle"],
                "order_index": i,
                "content_html": ch["content_html"],
            },
            upsert_on="course_id,slug",
        )
        print(f"  {i}/10 — {ch['title']}")

    # Verify
    rows = rest_get(
        "courses",
        select="title,course_chapters(count)",
    )
    print("\nVerification:")
    for r in rows:
        count = r.get("course_chapters", [{}])
        print(f"  {r['title']}: {count}")
    print("Done.")


if __name__ == "__main__":
    main()
