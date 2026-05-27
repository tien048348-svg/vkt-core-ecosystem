@echo off
for /D %%i in (*) do (
  copy "VKT_VERSION_UPGRADE_PROTOCOL.md" "%%i\VKT_VERSION_UPGRADE_PROTOCOL.md"
)
