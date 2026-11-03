#!/usr/bin/env python3
import re, shutil, sys
from pathlib import Path

PLUGIN_ID = "coollayout"
root = Path(__file__).resolve().parent.parent
if len(sys.argv) > 1:
    rel = Path(sys.argv[1])
else:
    rel = None
    for candidate in (root, root.parent, root.parent.parent):
        if (candidate / "public" / "index.html").is_file():
            rel = candidate
            break
    if rel is None:
        raise SystemExit("用法: python3 linux/uninstall.py 游戏目录")

index = rel / "public" / "index.html"
h = index.read_text(encoding="utf-8")
h = re.sub(r'\s*<script src="/mods/Coollayout/client\.js(?:\?[^"]*)?" defer></script>', "", h)
h = re.sub(r'\s*<script src="/sp-plugins/coollayout/client\.js(?:\?[^"]*)?" defer></script>', "", h)
index.write_text(h, encoding="utf-8")
targets = [
    rel / "plugins" / PLUGIN_ID,
    rel / "public" / "sp-plugins" / PLUGIN_ID,
    rel / "public" / "mods" / "Coollayout",
]
alt = rel.parent.parent / "plugins" / PLUGIN_ID
if alt.exists():
    targets.append(alt)
for p in targets:
    if p.exists():
        shutil.rmtree(p)
print("uninstalled", rel)
