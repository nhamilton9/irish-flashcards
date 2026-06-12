#!/usr/bin/env python3
"""Assemble the self-contained Irish Flashcards.html from the project files.

Head (everything up to and including the Babel CDN <script>) is taken from the
existing HTML so style tweaks there survive rebuilds. Data scripts and the
babel app block are regenerated from the project sources.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJ = ROOT / "project"
HTML = ROOT / "Irish Flashcards.html"

html = HTML.read_text(encoding="utf-8")
marker = html.index("babel.min.js")
cut = html.index("</script>", marker) + len("</script>")
head = html[:cut]

def src(name, required=True):
    p = PROJ / name
    if not p.exists():
        if required:
            raise SystemExit(f"missing {p}")
        return ""
    return p.read_text(encoding="utf-8").rstrip() + "\n"

out = [head, "\n<script>\n"]
out.append(src("words.js"))
out.append(src("words2.js", required=False))
out.append(src("examples.js", required=False))
out.append('</script>\n<script type="text/babel" data-presets="react">\n')
out.append(src("engine.jsx"))
out.append(src("variation-a.jsx"))
out.append('\nReactDOM.createRoot(document.getElementById("root")).render(<VariationA />);\n'
           "</script>\n</body>\n</html>\n")

HTML.write_text("".join(out), encoding="utf-8")
print(f"built {HTML} ({HTML.stat().st_size:,} bytes)")
