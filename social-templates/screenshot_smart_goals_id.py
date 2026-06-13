from playwright.sync_api import sync_playwright
import pathlib

html_path = pathlib.Path(r"C:\Users\user\Sites\crispy-development\social-templates\smart-goals-launch-id.html").resolve()
out_path  = pathlib.Path(r"C:\Users\user\Sites\crispy-development\social-templates\smart-goals-launch-id.png").resolve()

url = html_path.as_uri()

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1080, "height": 1080})
    page = ctx.new_page()
    page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(3500)
    page.screenshot(path=str(out_path), clip={"x": 0, "y": 0, "width": 1080, "height": 1080})
    browser.close()

print(f"Saved: {out_path}")
print(f"Size:  {out_path.stat().st_size // 1024} KB")
