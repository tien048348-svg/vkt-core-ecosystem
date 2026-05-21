$files = @(
    "e:\HMKT\VKT 055 979 3678\src\pages\SpyModule.tsx",
    "e:\HMKT\VKT 055 979 3678\src\pages\ScriptModule.tsx",
    "e:\HMKT\VKT 055 979 3678\src\pages\StudioModule.tsx",
    "e:\HMKT\VKT 055 979 3678\src\pages\SeoModule.tsx",
    "e:\HMKT\VKT 055 979 3678\src\pages\MarketModule.tsx"
)

$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f)
    $text = $enc1252.GetString($bytes)
    [System.IO.File]::WriteAllText($f, $text, $utf8NoBom)
    Write-Host "Fixed: $f"
}
Write-Host "All done!"
