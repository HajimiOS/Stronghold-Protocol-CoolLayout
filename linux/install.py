#!/usr/bin/env python3
import hashlib, re, shutil, sys
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
        raise SystemExit("用法: python3 linux/install.py 游戏目录")
if not (rel / "public" / "index.html").is_file() or not (rel / "public" / "js" / "boot.js").is_file():
    raise SystemExit("不是卫戍协议游戏目录")

def plugin_dirs(game: Path):
    dirs = [game / "plugins"]
    alt = game.parent.parent / "plugins"
    if alt.is_dir() and alt.resolve() != dirs[0].resolve():
        dirs.append(alt)
    return dirs

for base in plugin_dirs(rel):
    plugin = base / PLUGIN_ID
    if plugin.exists():
        shutil.rmtree(plugin)
    plugin.mkdir(parents=True)
    for name in ("plugin.json",):
        src = root / name
        if src.is_file():
            shutil.copy2(src, plugin / name)
    frame_src = root / "frame"
    if frame_src.is_dir():
        shutil.copytree(frame_src, plugin / "frame")

pub = rel / "public" / "sp-plugins" / PLUGIN_ID
if pub.exists():
    shutil.rmtree(pub)
pub.mkdir(parents=True)
shutil.copy2(root / "client.js", pub / "client.js")

old_pub = rel / "public" / "mods" / "Coollayout"
if old_pub.exists():
    shutil.rmtree(old_pub)

index = rel / "public" / "index.html"
h = index.read_text(encoding="utf-8")
h = re.sub(r'\s*<script src="/mods/Coollayout/client\.js(?:\?[^"]*)?" defer></script>', "", h)
h = re.sub(r'\s*<script src="/sp-plugins/coollayout/client\.js(?:\?[^"]*)?" defer></script>', "", h)
h = re.sub(r'\s*<script src="/js/ui/hub-parallax\.js(?:\?[^"]*)?" defer></script>', "", h)
h = re.sub(r'(/css/screens/room\.css)\?v=\d+', r"\1", h)
ver = hashlib.sha256((root / "client.js").read_bytes()).hexdigest()[:8]
tag = f'<script src="/sp-plugins/{PLUGIN_ID}/client.js?v={ver}" defer></script>'
needle = '<script src="/js/boot.js"></script>'
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
print("installed", rel, "-> plugins/" + PLUGIN_ID)
