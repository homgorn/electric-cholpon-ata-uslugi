import fs from 'fs';

const s = fs.readFileSync('scripts/lib/generator.ts', 'utf8');

// Fix: the issue is an extra } in the template literal
// Pattern: fmt(...})} · should be fmt(...}) · 
let fixed = s.replace(
  /fmt\(ctx\.site\.cta_whatsapp_template, \{ service: \`\\\\\$\{service\.name\} в \\\$\{ctx\.site\.city\}\}\}\)\}\) ·/g,
  'fmt(ctx.site.cta_whatsapp_template, { service: `\${service.name} в \${ctx.site.city}`}) ·'
);

fixed = fixed.replace(
  /fmt\(ctx\.site\.cta_whatsapp_template, \{ service: \`\\\\\$\{service\.name\} в \\\$\{ctx\.locPre\(loc\)\}\}\}\)\}\) ·/g,
  'fmt(ctx.site.cta_whatsapp_template, { service: `\${service.name} в \${ctx.locPre(loc)}`}) ·'
);

fixed = fixed.replace(
  /fmt\(ctx\.site\.cta_whatsapp_template, \{ service: \`Электрик в \\\$\{ctx\.locPre\(loc\)\}\}\)\}\) ·/g,
  'fmt(ctx.site.cta_whatsapp_template, { service: `Электрик в \${ctx.locPre(loc)}`}) ·'
);

fs.writeFileSync('scripts/lib/generator.ts', fixed);
console.log('fixed');