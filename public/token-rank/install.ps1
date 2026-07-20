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

  New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
  $ScriptUrl = $Endpoint -replace "/api/token-rank/upload$", "/token-rank/client.mjs"
  Invoke-WebRequest -Uri $ScriptUrl -OutFile $Client

  node $Client --token $Token --endpoint $Endpoint

  $Action = New-ScheduledTaskAction -Execute "node" -Argument "`"$Client`""
  $Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 30)
  Register-ScheduledTask -TaskName "ZNT Token Rank Sync" -Action $Action -Trigger $Trigger -Description "Sync AI coding tool token usage to znt.group" -Force | Out-Null

  Write-Output "Token 消耗榜已接入。配置目录：$InstallDir"
}
