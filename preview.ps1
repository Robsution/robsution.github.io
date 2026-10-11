$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$siteNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($siteNode) { $siteMajor = [int]((& $siteNode --version).TrimStart('v').Split('.')[0]) }
if (-not $siteNode -or $siteMajor -lt 22) {
    $siteNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
}
if (-not (Test-Path -LiteralPath $siteNode)) { throw 'Install Node.js 22 or newer to run the preview.' }
if (-not (Test-Path -LiteralPath 'node_modules\marked')) { throw 'Install the site dependencies first with npm ci using Node.js 22 or newer.' }
& $siteNode tools/build.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $siteNode tools/serve.mjs
