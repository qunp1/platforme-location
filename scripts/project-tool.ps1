param(
    [Parameter(Mandatory=$true,Position=0)]
    [ValidateSet('graphify','agent-reach','rea','strix')]
    [string]$Tool,
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$ToolArguments
)
$projectRoot = Split-Path $PSScriptRoot -Parent
if ($Tool -eq 'rea') {
    $runtime = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
    $entry = Join-Path $projectRoot '.tools/rea/node_modules/rea-agents/scripts/rea.mjs'
    & $runtime $entry @ToolArguments
} else {
    $entry = Join-Path $projectRoot ".tools/$Tool/venv/Scripts/$Tool.exe"
    if (-not (Test-Path -LiteralPath $entry)) { throw "Tool is not installed: $Tool" }
    & $entry @ToolArguments
}
exit $LASTEXITCODE
