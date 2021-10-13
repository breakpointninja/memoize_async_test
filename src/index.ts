/* eslint-disable no-console */
import crypto from 'crypto';
import fs from 'fs/promises';
import memoize_async from './memoize';

const file_hash = memoize_async({ ttl: 5, size: 100 }, async (file_path: string) => {
  console.log(`Calculating file hash for ${file_path}`);

  const buffer = await fs.readFile(file_path);
  return crypto.createHash('sha256').update(buffer).digest('base64');
});

async function main() {
  // The function works as expected when called the first time.
  // The file is read and hash is calculated
  const memoize_file_hash1 = await file_hash('src/memoize.ts');

  // The function returns from cache when called the second time,
  // as long as its within the ttl of 5 seconds
  const memoize_file_hash2 = await file_hash('src/memoize.ts');

  // The hashes ofcourse should match
  console.assert(memoize_file_hash1 === memoize_file_hash2, 'The hash matches');

  // The same applies even if the hashes are calculated in parallel.
  // The function is still only called once
  const [util_hash1, util_hash2, index_hash] = await Promise.all([
    file_hash('src/util.ts'),
    file_hash('src/util.ts'),
    file_hash('src/index.ts'),
  ]);

  // The hashes will match when one is used from cache
  console.assert(util_hash1 === util_hash2, 'The util hash match');

  // We make sure the hashes are different from what util hash returns
  console.assert(util_hash1 !== index_hash, 'The index hash does not match the util has');
}

main()
  .then(() => console.log('done'))
  .catch(e => console.error(e));
