function znt-tokenrank {
  param(
    [Parameter(Position=0)][string]$Command,
    [string]$Token,
    [string]$Endpoint
  )

  $InstallDir = Join-Path $env:USERPROFILE ".znt-tokenrank"
  $Client = Join-Path $InstallDir "client.mjs"

  if (-not $Token -or -not $Endpoint) {
    throw "缺少 --token 或 --endpoint，请从 Token 消耗榜页面复制专属命令。"
  }

  if ($Token -like "*xxx*" -or $Token -like "*your_private_token*") {
    throw "令牌还是占位符。请先在 Token 消耗榜页面点击「生成命令」，复制生成后的真实专属命令。"
  }

  $NodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
  if (-not $NodePath) {
    throw "没有找到 node。请先安装 Node.js，再重新运行接入命令。"
  }

  New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
  $ScriptUrl = $Endpoint -replace "/api/token-rank/upload$", "/token-rank/client.mjs"
  Invoke-WebRequest -Uri $ScriptUrl -OutFile $Client

  & $NodePath $Client --token $Token --endpoint $Endpoint
  if ($LASTEXITCODE -ne 0) {
    throw "首次同步失败，未安装后台任务。请确认你复制的是页面生成的真实专属命令。"
  }

  $Action = New-ScheduledTaskAction -Execute $NodePath -Argument "`"$Client`""
  $Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 60)
  Register-ScheduledTask -TaskName "ZNT Token Rank Sync" -Action $Action -Trigger $Trigger -Description "Sync AI coding tool token usage to znt.group" -Force | Out-Null

  Write-Output "Token 消耗榜已接入。配置目录：$InstallDir"
}
