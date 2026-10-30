#!/usr/bin/env python3
import re, shutil, sys
from pathlib import Path

if len(sys.argv) < 2:
    raise SystemExit("用法: python3 linux/uninstall.py 游戏目录")
rel = Path(sys.argv[1])
index = rel / "public" / "index.html"
if index.exists():
    h = index.read_text(encoding="utf-8")
    h = re.sub(r'\s*<script src="/mods/Coollayout/client\.js(?:\?[^"]*)?" defer></script>', "", h)
    index.write_text(h, encoding="utf-8")
pub = rel / "public" / "mods" / "Coollayout"
if pub.exists():
    shutil.rmtree(pub)
print("removed", rel)
