// scripts/generate-content.ts — CLI wrapper for generator
import { generateContent } from './lib/generator.js';
import { loadInputData } from './lib/loader.js';
import { genLogger } from './lib/logger.js';
import * as path from 'path';

async function main() {
  try {
    const input = await loadInputData();
    const report = await generateContent({ input });
    genLogger.info({ total: report.total_pages }, '✅ Generation complete');
    process.exit(0);
  } catch (err) {
    genLogger.error({ err }, '❌ Generation failed');
    process.exit(1);
  }
}

main();