param(
  [string]$GameDirectory,
  [ValidateSet('install', 'uninstall')]
  [string]$Mode = 'install'
)
$ErrorActionPreference = 'Stop'
$PluginId = 'coollayout'
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
function Get-PluginRoots([string]$game) {
  $roots = @((Join-Path $game 'plugins'))
  $alt = Join-Path (Split-Path -Parent (Split-Path -Parent $game)) 'plugins'
  if ((Test-Path -LiteralPath $alt) -and ((Resolve-Path $alt).Path -ne (Resolve-Path $roots[0]).Path)) {
    $roots += $alt
  }
  return $roots
}
$pluginRoots = Get-PluginRoots $GameDirectory
$pluginDir = Join-Path $pluginRoots[0] $PluginId
$pubDir = Join-Path $GameDirectory "public\sp-plugins\$PluginId"
$oldDir = Join-Path $GameDirectory 'public\mods\Coollayout'
$patOld = '(?s)\s*<script src="/mods/Coollayout/client\.js(?:\?[^"]*)?" defer></script>'
$patNew = '(?s)\s*<script src="/sp-plugins/coollayout/client\.js(?:\?[^"]*)?" defer></script>'

$html = [IO.File]::ReadAllText($indexPath)
$html = [regex]::Replace($html, $patOld, '')
$html = [regex]::Replace($html, $patNew, '')

if ($Mode -eq 'uninstall') {
  [IO.File]::WriteAllText($indexPath, $html, $utf8)
  foreach ($base in $pluginRoots) {
    $d = Join-Path $base $PluginId
    if (Test-Path -LiteralPath $d) { Remove-Item -LiteralPath $d -Recurse -Force }
  }
  foreach ($d in @($pubDir, $oldDir)) {
    if (Test-Path -LiteralPath $d) { Remove-Item -LiteralPath $d -Recurse -Force }
  }
  Write-Host "已卸载 $GameDirectory"
  exit 0
}

$src = Join-Path $root 'client.js'
if (-not (Test-Path -LiteralPath $src)) { throw '找不到 client.js' }
foreach ($base in $pluginRoots) {
  $dir = Join-Path $base $PluginId
  if (Test-Path -LiteralPath $dir) { Remove-Item -LiteralPath $dir -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $pj = Join-Path $root 'plugin.json'
  if (Test-Path -LiteralPath $pj) { Copy-Item -LiteralPath $pj -Destination (Join-Path $dir 'plugin.json') -Force }
  $frame = Join-Path $root 'frame'
  if (Test-Path -LiteralPath $frame) { Copy-Item -LiteralPath $frame -Destination (Join-Path $dir 'frame') -Recurse -Force }
}

if (Test-Path -LiteralPath $pubDir) { Remove-Item -LiteralPath $pubDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $pubDir | Out-Null
Copy-Item -LiteralPath $src -Destination (Join-Path $pubDir 'client.js') -Force
if (Test-Path -LiteralPath $oldDir) { Remove-Item -LiteralPath $oldDir -Recurse -Force }

$sha = [Security.Cryptography.SHA256]::Create().ComputeHash([IO.File]::ReadAllBytes($src))
$ver = ([BitConverter]::ToString($sha)).Replace('-', '').Substring(0, 8).ToLower()
$tag = "<script src=`"/sp-plugins/$PluginId/client.js?v=$ver`" defer></script>"
$needle = '<script src="/js/boot.js"></script>'
if (-not $html.Contains($needle)) { throw '找不到 boot.js' }
$html = $html.Replace($needle, "$tag`r`n  $needle")
[IO.File]::WriteAllText($indexPath, $html, $utf8)
Write-Host "已安装 $GameDirectory -> plugins\$PluginId"
