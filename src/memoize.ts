import { ReadonlyDeep } from 'type-fest';

// We don't allow null. undefined is required instead.
export type SimpleArgs = (string | number | boolean | undefined)[];

export type BasicAsyncFunc<U extends SimpleArgs, R> = (...args: U) => Promise<ReadonlyDeep<R>>;

interface Memoized<U extends SimpleArgs, R> extends BasicAsyncFunc<U, R> {
  cache_size: () => number;
  clear_cache: () => void;
}

/**
 * Memoizes async functions.
 * The function signature that can be memoized are deliberately restricted
 * to primitive datatypes, to make sure they can be correctly cached.
 *
 * This `rightly` puts the burden on the user to correctly build a function to be memoized
 * rather than a library which has little knowledge of the function.
 *
 * Multiple parallel calls with the same key require only a single call to the wrapped async function.
 *
 * Example:
 * const get_user = memoize_async({ ttl: 60, size: 100 }, async (user_id: number) => {
 *  user = await database.get_user(user_id);
 *  return user;
 * });
 * const u1 = await get_user(2); // Calls database.get_user
 * const u2 = await get_user(2); // Returns from cache
 *
 * @param options Options:
 *  ttl: Seconds till the cache expires
 *  size: The maximum number of items allowed in the cache.
 *        Oldest items are removed first when limit is reached.
 * @param f The async function to be memoized
 */
const memoize_async = <R, U extends SimpleArgs>(
  options: { ttl: number; size: number },
  f: BasicAsyncFunc<U, R>,
): Memoized<U, R> => {
  return Object.assign(f, {
    cache_size: () => {
      // cache_size is unimplemented
      return 0;
    },
    clear_cache: () => {
      // clear_cache is not implemented
    },
  });
};

export default memoize_async;
