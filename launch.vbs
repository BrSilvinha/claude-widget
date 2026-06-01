Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\jhami\Documents\Proyectos\claude-widget"
WshShell.Run """node_modules\.bin\electron.cmd"" .", 0, False