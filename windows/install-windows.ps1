param(
  [string]$GameDirectory,
  [ValidateSet('install', 'uninstall')]
  [string]$Mode = 'install'
)
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$root = Split-Path -Parent $here

function Test-Game([string]$dir) {
  $index = Join-Path $dir 'public\index.html'
  $boot = Join-Path $dir 'public\js\boot.js'
  return (Test-Path -LiteralPath $index) -and (Test-Path -LiteralPath $boot)
}

if (-not $GameDirectory) {
  foreach ($candidate in @($here, $root, (Split-Path -Parent $root))) {
    if (Test-Game $candidate) { $GameDirectory = $candidate; break }
  }
}
if (-not $GameDirectory) {
  Add-Type -AssemblyName System.Windows.Forms
  $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
  $dialog.Description = '选择卫戍协议的游戏目录'
  if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { throw '未选择游戏目录' }
  $GameDirectory = $dialog.SelectedPath
}
if (-not (Test-Game $GameDirectory)) { throw '所选位置不是卫戍协议的游戏目录' }

$utf8 = New-Object System.Text.UTF8Encoding $false
$indexPath = Join-Path $GameDirectory 'public\index.html'
$destDir = Join-Path $GameDirectory 'public\mods\Coollayout'
$pattern = '(?s)\s*<script src="/mods/Coollayout/client\.js(?:\?[^"]*)?" defer></script>'
$html = [IO.File]::ReadAllText($indexPath)
$html = [regex]::Replace($html, $pattern, '')

if ($Mode -eq 'uninstall') {
  if ($html -ne [IO.File]::ReadAllText($indexPath)) { [IO.File]::WriteAllText($indexPath, $html, $utf8) }
  if (Test-Path -LiteralPath $destDir) { Remove-Item -LiteralPath $destDir -Recurse -Force }
  Write-Host "已卸载 $GameDirectory"
  exit 0
}

$src = Join-Path $root 'client.js'
if (-not (Test-Path -LiteralPath $src)) { throw '找不到 client.js' }
New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -LiteralPath $src -Destination (Join-Path $destDir 'client.js') -Force
$sha = [Security.Cryptography.SHA256]::Create().ComputeHash([IO.File]::ReadAllBytes($src))
$ver = ([BitConverter]::ToString($sha)).Replace('-', '').Substring(0, 8).ToLower()
$tag = "<script src=`"/mods/Coollayout/client.js?v=$ver`" defer></script>"
$needle = '<script src="/js/boot.js"></script>'
if (-not $html.Contains($needle)) { throw '找不到 boot.js' }
$html = $html.Replace($needle, "$tag`r`n  $needle")
[IO.File]::WriteAllText($indexPath, $html, $utf8)
Write-Host "已安装 $GameDirectory"
