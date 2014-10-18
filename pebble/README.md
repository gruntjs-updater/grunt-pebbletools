# Workspace version control

workspace.xml and workspace.min.xml need to be kept in sync.  When downloading
the workspace from the browser, it should be saved to workspace.min.xml, then
use prettify to update workspace.xml.  When editing workspace.xml directly,
minified.js should be used to create workspace.min.xml.

### development with pebble app

for now, download workspace.json, prettify and vimdiff

### extractDocuments

This is used to extract workspace into the tables directory (xml)

### deploy (basic dev)

This is used when editing workspace.xml directly.  It will create deployments
in ../pebble/karam/deployments and ../pebble-dev/root/deployments



