// scripts/validate.ts — QA gate with strict types
import { validateAll } from './lib/validator.js';
import { valiLogger } from './lib/logger.js';
import { fileURLToPath } from 'url';
import * as path from 'path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const postbuild = process.argv.includes('--postbuild');

async function main() {
  try {
    const result = await validateAll({ root: ROOT, postbuild });
    if (result.errors.length) {
      valiLogger.error({ errors: result.errors.length }, 'Validation failed');
      process.exit(1);
    } else {
      valiLogger.info({ pages: result.pagesChecked, warnings: result.warnings.length }, 'All checks passed ✓');
      process.exit(0);
    }
  } catch (err) {
    valiLogger.error({ err }, 'Validation crashed');
    process.exit(1);
  }
}

main();