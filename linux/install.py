#!/usr/bin/env python3
import hashlib, re, shutil, sys
from pathlib import Path

mod = Path(__file__).resolve().parent
root = mod.parent
if len(sys.argv) > 1:
    rel = Path(sys.argv[1])
else:
    rel = None
    for candidate in (root, root.parent):
        if (candidate / "public" / "index.html").is_file():
            rel = candidate
            break
    if rel is None:
        raise SystemExit("用法: python3 linux/install.py 游戏目录")
pub = rel / "public" / "mods" / "Coollayout"
pub.mkdir(parents=True, exist_ok=True)
shutil.copyfile(root / "client.js", pub / "client.js")
index = rel / "public" / "index.html"
h = index.read_text(encoding="utf-8")
h = re.sub(r'\s*<script src="/js/ui/hub-parallax\.js(?:\?[^"]*)?" defer></script>', "", h)
h = re.sub(r'(/css/screens/room\.css)\?v=\d+', r"\1", h)
ver = hashlib.sha256((root / "client.js").read_bytes()).hexdigest()[:8]
tag = f'<script src="/mods/Coollayout/client.js?v={ver}" defer></script>'
h = re.sub(r'<script src="/mods/Coollayout/client\.js(?:\?[^"]*)?" defer></script>', tag, h)
needle = '<script src="/js/boot.js"></script>'
if tag not in h:
    if needle not in h:
        raise SystemExit("boot.js not found")
    h = h.replace(needle, tag + "\n  " + needle, 1)
index.write_text(h, encoding="utf-8")
css = rel / "public" / "css" / "screens" / "room.css"
if css.exists():
    t = css.read_text(encoding="utf-8")
    i = t.find("/* rseat-sq */")
    if i >= 0:
        css.write_text(t[:i].rstrip() + "\n", encoding="utf-8")
old = rel / "public" / "js" / "ui" / "hub-parallax.js"
if old.exists():
    old.unlink()
print("installed", rel)
