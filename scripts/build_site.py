#!/usr/bin/env python3
"""Build the GitHub Pages static site from one Markdown vault and shared templates.

The script intentionally uses only the Python standard library so GitHub Pages
maintenance does not depend on a Node/Ruby toolchain. It is a small renderer for
this repository's current Markdown subset plus wiki-link graph metadata.
"""
from __future__ import annotations

import argparse, html, json, re, shutil, sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "site" / "site_manifest.json"
TEMPLATE = ROOT / "site" / "templates" / "page.html"

@dataclass
class Page:
    source: Path | None
    slug: str
    title: str
    description: str
    tags: list[str] = field(default_factory=list)
    body_md: str = ""
    section: str = ""
    links: list[str] = field(default_factory=list)


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def parse_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    raw = text[4:end].strip().splitlines()
    data: dict[str, object] = {}
    for line in raw:
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            data[key.strip()] = [v.strip().strip('"\'') for v in value[1:-1].split(",") if v.strip()]
        else:
            data[key.strip()] = value.strip('"')
    return data, text[end + 5 :].lstrip()


def title_to_slug(title: str) -> str:
    slug = title.lower().replace("&", " and ")
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    return slug


def section_for_slug(slug: str) -> str:
    first = slug.split("/", 1)[0]
    return {"": "Home", "scenarios": "Scenarios", "operations": "Operations", "concepts": "Concepts", "artefacts": "Artefacts", "install": "Install"}.get(first, first.title())


def load_pages(source_dir: Path) -> list[Page]:
    pages: list[Page] = []
    for path in sorted(source_dir.rglob("*.md")):
        meta, body = parse_frontmatter(path.read_text(encoding="utf-8"))
        rel = path.relative_to(source_dir).with_suffix("")
        slug = "" if rel.as_posix() == "index" else rel.as_posix()
        title = str(meta.get("title") or path.stem.replace("-", " ").title())
        description = str(meta.get("description") or "")
        tags = list(meta.get("tags") or [])
        links = re.findall(r"\[\[([^\]]+)\]\]", body)
        pages.append(Page(path, slug, title, description, tags, body, section_for_slug(slug), links))
    return pages


def replace_wikilinks(text: str, title_map: dict[str, Page], current_slug: str) -> str:
    def repl(match: re.Match[str]) -> str:
        target = match.group(1)
        label = target.split("|", 1)[-1].strip()
        key = target.split("|", 1)[0].strip().lower()
        page = title_map.get(key) or title_map.get(title_to_slug(key))
        if not page:
            return html.escape(label)
        return f'[{label}]({relative_url(current_slug, page.slug)})'
    return re.sub(r"\[\[([^\]]+)\]\]", repl, text)


def inline_md(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", lambda m: f'<a href="{html.escape(m.group(2), quote=True)}">{m.group(1)}</a>', text)
    return text


def render_markdown(markdown: str, page: Page, title_map: dict[str, Page]) -> str:
    markdown = replace_wikilinks(markdown, title_map, page.slug)
    blocks: list[str] = []
    lines = markdown.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1; continue
        if line.startswith("```"):
            lang = line[3:].strip()
            buf=[]; i+=1
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i]); i+=1
            i += 1
            cls = "prompt" if lang != "mermaid" else "prompt mermaid"
            blocks.append(f'<pre class="{cls}"><code>{html.escape(chr(10).join(buf))}</code></pre>')
            continue
        m = re.match(r"^(#{1,6})\s+(.+)$", line)
        if m:
            level = len(m.group(1)); content = inline_md(m.group(2))
            blocks.append(f"<h{level}>{content}</h{level}>"); i += 1; continue
        if line.startswith("> "):
            buf=[]
            while i < len(lines) and lines[i].startswith("> "):
                buf.append(lines[i][2:]); i+=1
            blocks.append(f"<blockquote><p>{inline_md(' '.join(buf))}</p></blockquote>"); continue
        if re.match(r"^[-*]\s+", line):
            items=[]
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i]):
                items.append(f"<li>{inline_md(re.sub(r'^[-*]\\s+', '', lines[i]))}</li>"); i+=1
            blocks.append("<ul>" + "".join(items) + "</ul>"); continue
        if re.match(r"^\d+\.\s+", line):
            items=[]
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i]):
                items.append(f"<li>{inline_md(re.sub(r'^\\d+\\.\\s+', '', lines[i]))}</li>"); i+=1
            blocks.append("<ol>" + "".join(items) + "</ol>"); continue
        para=[line]; i+=1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{1,6})\s+|^[-*]\s+|^\d+\.\s+|^>|^```", lines[i]):
            para.append(lines[i]); i+=1
        blocks.append(f"<p>{inline_md(' '.join(para))}</p>")
    return "\n".join(blocks)


def relative_url(from_slug: str, to_slug: str) -> str:
    from_depth = 0 if not from_slug else len(from_slug.split("/"))
    prefix = "../" * from_depth
    return prefix + (to_slug + "/" if to_slug else "")


def root_prefix(slug: str) -> str:
    return "../" * (0 if not slug else len(slug.split("/")))


def render_nav(manifest: dict, slug: str) -> str:
    prefix = root_prefix(slug)
    return "".join(f'<a href="{prefix}{item["url"]}" class="nav-link">{html.escape(item["label"])}</a>' for item in manifest["nav"])


def panel_list(title: str, pages: Iterable[Page], current_slug: str) -> str:
    items = "".join(f'<li><a href="{relative_url(current_slug, p.slug)}">{html.escape(p.title)}</a></li>' for p in pages)
    return f'<div class="panel-card"><h2>{html.escape(title)}</h2><ul class="compact-list">{items}</ul></div>'


def render_left_panel(pages: list[Page], current_slug: str) -> str:
    scenarios = [p for p in pages if p.slug.startswith("scenarios/") and p.slug != "scenarios/scenarios"]
    operations = [p for p in pages if p.slug.startswith("operations/")]
    return panel_list("Scenarios", scenarios, current_slug) + panel_list("Core operations", operations, current_slug)


def render_right_panel(page: Page, title_map: dict[str, Page]) -> str:
    related = []
    for link in page.links:
        key = link.split("|",1)[0].strip().lower()
        target = title_map.get(key) or title_map.get(title_to_slug(key))
        if target and target.slug != page.slug and target not in related:
            related.append(target)
    related_items = "".join(f'<li><a href="{relative_url(page.slug, p.slug)}">{html.escape(p.title)}</a></li>' for p in related) or "<li>No direct links.</li>"
    tags = "".join(f'<span class="tag">{html.escape(t)}</span>' for t in page.tags)
    graph = f'<svg class="local-graph" viewBox="0 0 320 120" role="img" aria-label="Local page marker"><circle class="node center" cx="160" cy="44" r="15"/><text x="160" y="78" text-anchor="middle">{html.escape(page.title[:28])}</text></svg>'
    return f'<div class="panel-card graph-card"><h2>Local graph</h2>{graph}</div><div class="panel-card"><h2>Related</h2><ul>{related_items}</ul></div><div class="panel-card"><h2>Tags</h2><div class="tags">{tags}</div></div>'


def apply_template(template: str, values: dict[str, str]) -> str:
    for key, value in values.items():
        template = template.replace("{{ " + key + " }}", value)
    return template


def generated_indexes(manifest: dict, pages: list[Page]) -> list[Page]:
    out = []
    for spec in manifest.get("generated_indexes", []):
        collection = [p for p in pages if p.slug.startswith(spec["source_collection"] + "/")]
        cards = ['# ' + spec["title"], '', spec["description"], '']
        for p in collection:
            cards.append(f'- [{p.title}](../{p.slug.split("/",1)[1]}/) — {p.description}')
        out.append(Page(None, spec["slug"], spec["title"], spec["description"], [spec["source_collection"]], "\n".join(cards), spec["section"]))
    return out


def build(output_dir: Path, clean: bool = False) -> None:
    manifest = load_manifest(); source = ROOT / manifest["source_dir"]
    pages = load_pages(source); pages += generated_indexes(manifest, pages)
    title_map = {p.title.lower(): p for p in pages} | {title_to_slug(p.title): p for p in pages}
    template = TEMPLATE.read_text(encoding="utf-8")
    if clean and output_dir.exists():
        # Keep binary downloads and existing static assets unless explicitly overwritten.
        for child in output_dir.iterdir():
            if child.name not in {"assets", "downloads", "robots.txt"}:
                if child.is_dir(): shutil.rmtree(child)
                else: child.unlink()
    output_dir.mkdir(parents=True, exist_ok=True)
    search = []

    raw_base_url = manifest.get("base_url", "")
    base_url = raw_base_url.rstrip("/") + "/" if raw_base_url else ""
    lastmod = manifest.get("release_date", "")
    sitemap_urls = []
    for page in pages:
        content = render_markdown(page.body_md, page, title_map)
        html_text = apply_template(template, {
            "page_title": html.escape(f"{page.title} | {manifest['site_title']}", quote=True),
            "og_title": html.escape(page.title, quote=True),
            "page_description": html.escape(page.description, quote=True),
            "root_prefix": root_prefix(page.slug),
            "page_slug": html.escape(page.slug or "index", quote=True),
            "site_title": html.escape(manifest["site_title"]),
            "version": html.escape(manifest["version"]),
            "primary_nav": render_nav(manifest, page.slug),
            "left_panel": render_left_panel(pages, page.slug),
            "content": content,
            "right_panel": render_right_panel(page, title_map),
            "footer": html.escape(f"{manifest['site_title']} Site {manifest['version']}. Source-available scenario documentation. Commercial asset production requires a KNOWDYN license."),
        })
        dest = output_dir / page.slug / "index.html" if page.slug else output_dir / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html_text, encoding="utf-8")
        search.append({"title": page.title, "desc": page.description, "url": "./" + (page.slug + "/" if page.slug else ""), "section": page.section, "tags": page.tags})
        if base_url:
            loc = base_url + (page.slug + "/" if page.slug else "")
            sitemap_urls.append(f"<url><loc>{html.escape(loc)}</loc>" + (f"<lastmod>{html.escape(lastmod)}</lastmod>" if lastmod else "") + "</url>")
    assets = output_dir / "assets"; assets.mkdir(exist_ok=True)
    (assets / "search-index.json").write_text(json.dumps(search, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if sitemap_urls:
        (output_dir / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(sitemap_urls) + "</urlset>\n", encoding="utf-8")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "docs", help="Output directory (default: docs)")
    parser.add_argument("--clean", action="store_true", help="Remove generated HTML paths before writing")
    args = parser.parse_args(argv)
    build(args.output if args.output.is_absolute() else ROOT / args.output, args.clean)
    return 0

if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
