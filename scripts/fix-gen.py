with open('scripts/generate-content.mjs', 'r') as f:
    s = f.read()

# Fix the clean section to handle non-empty directories properly
s = s.replace(
    """// clean
for (const d of ['content/services', 'content/geo', 'content/locations', 'content/categories', 'content/tags']) {
  fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
}
fs.rmSync(path.join(ROOT, 'public/md'), { recursive: true, force: true });""",
    """// clean - properly handle non-empty directories
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        cleanDir(fullPath);
        try { fs.rmdirSync(fullPath); } catch (e) { /* ignore */ }
      } else {
        try { fs.unlinkSync(fullPath); } catch (e) { /* ignore */ }
      }
    }
    try { fs.rmdirSync(dir); } catch (e) { /* ignore */ }
  }
}
for (const d of ['content/services', 'content/geo', 'content/locations', 'content/categories', 'content/tags']) {
  cleanDir(path.join(ROOT, d));
}
if (fs.existsSync(path.join(ROOT, 'public/md'))) {
  cleanDir(path.join(ROOT, 'public/md'));
}""")

with open('scripts/generate-content.mjs', 'w') as f:
    f.write(s)

print('fixed clean function')