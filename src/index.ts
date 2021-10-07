/* eslint-disable no-console */
import crypto from 'crypto';
import fs from 'fs/promises';
import memoize_async from './memoize';

const file_hash = memoize_async({ ttl: 5, size: 100 }, async (file_path: string) => {
  console.log(`Calculating file size for ${file_path}`);

  const buffer = await fs.readFile(file_path);
  return crypto.createHash('sha256').update(buffer).digest('base64');
});

async function main() {
  const hashes: string[] = await Promise.all([
    file_hash('src/memoize.ts'),
    file_hash('src/memoize.ts'),
    file_hash('src/index.ts'),
  ]);

  console.log(hashes);
}

main()
  .then(() => console.log('done'))
  .catch(e => console.error(e));
