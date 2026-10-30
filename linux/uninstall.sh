#!/bin/sh
set -e
rel=$1
if [ -z "$rel" ] || [ ! -f "$rel/public/index.html" ]; then
  echo "用法: sh linux/uninstall.sh 游戏目录" >&2
  exit 1
fi
tmp=$(mktemp)
awk '
  /<script src="\/mods\/Coollayout\/client\.js/ { next }
  { print }
' "$rel/public/index.html" > "$tmp"
mv "$tmp" "$rel/public/index.html"
rm -rf "$rel/public/mods/Coollayout"
echo "已卸载 $rel"
