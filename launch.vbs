Dim WshShell, scriptDir, electronExe, appDir
Set WshShell = CreateObject("WScript.Shell")
scriptDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
appDir = Left(scriptDir, Len(scriptDir) - 1)
electronExe = scriptDir & "node_modules\electron\dist\electron.exe"
WshShell.Run Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appDir & Chr(34), 0, False
