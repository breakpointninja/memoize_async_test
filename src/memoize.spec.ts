/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import { times, zip } from 'lodash';
import memoize_async from './memoize';
import { rand_range, sleep } from './util';

describe('memoize async correctly caches', () => {
  it.concurrent('correctly caches calls in sequence', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 5, size: 100 }, async () => {
      promise_called++;
      await sleep(100);
      return 'test';
    });
    const call_times = 10;
    for (const _ of times(call_times)) {
      const r1 = await cached_fn();
      expect(r1).to.equal('test');
    }

    expect(promise_called).to.equal(1);
    expect(cached_fn.cache_size()).to.equal(1);
  });

  it.concurrent('correctly caches calls in parallel', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 5, size: 100 }, async () => {
      promise_called++;
      await sleep(200);
      return 'test';
    });
    const call_times = 10;
    const results = await Promise.all(times(call_times).map(() => cached_fn()));
    expect(results.length).to.equal(call_times);
    expect(results).to.deep.equal(times(call_times).map(() => 'test'));

    // The most important bit
    expect(promise_called).to.equal(1);
    expect(cached_fn.cache_size()).to.equal(1);
  });

  it.concurrent('correctly caches calls with number args', async () => {
    for (const _ of Array(10)) {
      let promise_called = 0;
      const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (i: number) => {
        promise_called++;
        await sleep(100);
        return i;
      });
      const call_times = rand_range(10, 30);
      const sequence: number[] = [...Array(call_times).keys()];
      const repeat = rand_range(2, 10);

      const results = await Promise.all(
        times(repeat)
          .map(() => sequence.map(i => cached_fn(i)))
          .flat(),
      );
      expect(results.length).to.equal(call_times * repeat);
      expect(results).to.deep.equal(
        times(repeat)
          .map(() => sequence)
          .flat(),
      );

      expect(promise_called).to.equal(call_times);
      expect(cached_fn.cache_size()).to.equal(call_times);
    }
  });

  it.concurrent('correctly limits cache size on set', async () => {
    for (const _ of Array(10)) {
      let promise_called = 0;
      const cached_fn = memoize_async({ ttl: 5, size: 1 }, async (i: number) => {
        promise_called++;
        await sleep(100);
        return i;
      });
      const call_times = rand_range(10, 30);
      const sequence: number[] = [...Array(call_times).keys()];
      const repeat = rand_range(2, 10);

      const results = await Promise.all(
        times(repeat)
          .map(() => sequence.map(i => cached_fn(i)))
          .flat(),
      );
      expect(results.length).to.equal(call_times * repeat);
      expect(results).to.deep.equal(
        times(repeat)
          .map(() => sequence)
          .flat(),
      );

      expect(promise_called).to.equal(call_times);
      expect(cached_fn.cache_size()).to.equal(1);
    }
  });

  it.concurrent('correctly caches calls with string args', async () => {
    for (const _ of Array(10)) {
      let promise_called = 0;
      const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (i: string) => {
        promise_called++;
        await sleep(100);
        return i;
      });
      const call_times = rand_range(10, 30);
      const sequence: string[] = [...Array(call_times).keys()].map(i => i.toString());
      const repeat = rand_range(2, 10);

      const results = await Promise.all(
        times(repeat)
          .map(() => sequence.map(i => cached_fn(i)))
          .flat(),
      );
      expect(results.length).to.equal(call_times * repeat);
      expect(results).to.deep.equal(
        times(repeat)
          .map(() => sequence)
          .flat(),
      );

      expect(promise_called).to.equal(call_times);
      expect(cached_fn.cache_size()).to.equal(call_times);
    }
  });

  it.concurrent('correctly caches calls with boolean args', async () => {
    for (const _ of Array(10)) {
      let promise_called = 0;
      const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (i: boolean) => {
        promise_called++;
        await sleep(100);
        return i;
      });
      const call_times = rand_range(10, 30);
      const sequence: boolean[] = [...Array(call_times).keys()].map(i => i % 2 === 0);
      const repeat = rand_range(2, 10);

      const results = await Promise.all(
        times(repeat)
          .map(() => sequence.map(i => cached_fn(i)))
          .flat(),
      );
      expect(results.length).to.equal(call_times * repeat);
      expect(results).to.deep.equal(
        times(repeat)
          .map(() => sequence)
          .flat(),
      );

      // Because only 2 boolean values
      expect(promise_called).to.equal(2);
      expect(cached_fn.cache_size()).to.equal(2);
    }
  });

  it.concurrent('correctly caches calls with number args and json return', async () => {
    for (const _ of Array(10)) {
      let promise_called = 0;
      const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (i: number) => {
        promise_called++;
        await sleep(100);
        return { n: i, s: i.toString() };
      });
      const call_times = rand_range(10, 30);
      const sequence: number[] = [...Array(call_times).keys()];
      const repeat = rand_range(2, 10);

      const results = await Promise.all(
        times(repeat)
          .map(() => sequence.map(i => cached_fn(i)))
          .flat(),
      );

      expect(results.length).to.equal(call_times * repeat);
      expect(results).to.deep.equal(
        times(repeat)
          .map(() => sequence.map(i => ({ n: i, s: i.toString() })))
          .flat(),
      );

      expect(promise_called).to.equal(call_times);
      expect(cached_fn.cache_size()).to.equal(call_times);
    }
  });

  it.concurrent('correctly expires cache 1', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 1, size: 100 }, async () => {
      promise_called++;
      await sleep(100);
      return 'test';
    });
    const r1 = await cached_fn();
    expect(r1).to.equal('test');
    await sleep(300);
    const r2 = await cached_fn();
    expect(r2).to.equal('test');

    expect(promise_called).to.equal(1);
    expect(cached_fn.cache_size()).to.equal(1);
  });

  it.concurrent('correctly expires cache 2', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 1, size: 1 }, async () => {
      promise_called++;
      await sleep(100);
      return 'test';
    });
    const r1 = await cached_fn();
    expect(r1).to.equal('test');

    await sleep(1200);

    const r2 = await cached_fn();
    expect(r2).to.equal('test');

    expect(promise_called).to.equal(2);
    expect(cached_fn.cache_size()).to.equal(1);
  });

  it.concurrent('correctly limits cache size', async () => {
    for (const _ of Array(20)) {
      let promise_called = 0;
      const call_times = rand_range(3, 50);
      const cache_size_limit = call_times - rand_range(1, call_times - 1);
      const sequence: number[] = [...Array(call_times).keys()];
      const cached_fn = memoize_async({ ttl: 60, size: cache_size_limit }, async (i: number) => {
        promise_called++;
        await sleep(1);
        return i;
      });

      for (const i of sequence) {
        const res = await cached_fn(i);
        expect(res).to.equal(i);
      }
      sequence.reverse();
      for (const i of sequence) {
        const res = await cached_fn(i);
        expect(res).to.equal(i);
      }

      expect(promise_called).to.equal(2 * call_times - cache_size_limit);
      expect(cached_fn.cache_size()).to.equal(cache_size_limit);
    }
  });

  it.concurrent('removes the oldest cache first', async () => {
    for (const _ of Array(20)) {
      let promise_called = 0;
      const call_times = rand_range(3, 50);
      const cache_size_limit = call_times - rand_range(1, call_times - 1);
      const sequence: number[] = [...Array(call_times).keys()];
      const cached_fn = memoize_async({ ttl: 60, size: cache_size_limit }, async (i: number) => {
        promise_called++;
        await sleep(1);
        return i;
      });

      for (const i of sequence) {
        const res = await cached_fn(i);
        expect(res).to.equal(i);
      }

      for (const i of sequence.slice(0, call_times - cache_size_limit)) {
        const res = await cached_fn(i);
        expect(res).to.equal(i);
      }

      expect(promise_called).to.equal(2 * call_times - cache_size_limit);
      expect(cached_fn.cache_size()).to.equal(cache_size_limit);
    }
  });

  it.concurrent('rejects all parallel error requests', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 5, size: 50 }, async (i: string) => {
      promise_called++;
      await sleep(10);
      throw new Error(i);
    });
    const call_times = 10;
    const sequence: string[] = [...Array(call_times).keys()].map(i => i.toString());
    const promises = sequence.map(i => cached_fn(i));
    for (const [i, p] of zip(sequence, promises)) {
      let error: Error | undefined;
      try {
        await p;
      } catch (e) {
        error = e as Error;
      }

      expect(error).to.be.an.instanceOf(Error);
      expect(error?.message).to.equal(i?.toString());
    }

    const promises2 = sequence.map(i => cached_fn(i));
    for (const [i, p] of zip(sequence, promises2)) {
      let error: Error | undefined;
      try {
        await p;
      } catch (e) {
        error = e as Error;
      }

      expect(error).to.be.an.instanceOf(Error);
      expect(error?.message).to.equal(i?.toString());
    }

    // The most important bit
    expect(promise_called).to.equal(call_times * 2);
    expect(cached_fn.cache_size()).to.equal(0);
  });

  it.concurrent('can clear cache', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 5, size: 100 }, async () => {
      promise_called++;
      await sleep(100);
      return 'test';
    });
    const call_times = 10;
    for (const _ of times(call_times)) {
      const r1 = await cached_fn();
      expect(r1).to.equal('test');
    }

    expect(promise_called).to.equal(1);
    expect(cached_fn.cache_size()).to.equal(1);

    cached_fn.clear_cache();
    expect(cached_fn.cache_size()).to.equal(0);

    for (const _ of times(call_times)) {
      const r1 = await cached_fn();
      expect(r1).to.equal('test');
    }

    expect(promise_called).to.equal(2);
    expect(cached_fn.cache_size()).to.equal(1);
  });

  it.concurrent('correctly caches calls with multiple args', async () => {
    for (const _ of Array(10)) {
      let promise_called = 0;
      const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (i: string, j: number, b?: boolean) => {
        expect(i).to.equal(j.toString());
        expect(b).to.equal(j % 2 === 0 ? true : undefined);

        promise_called++;
        if (b) {
          await sleep(100);
        }
        return j;
      });
      const call_times = rand_range(10, 30);
      const sequence: number[] = [...Array(call_times).keys()].map(i => i);
      const repeat = rand_range(2, 10);

      const results = await Promise.all(
        times(repeat)
          .map(() => sequence.map(i => cached_fn(i.toString(), i, i % 2 === 0 ? true : undefined)))
          .flat(),
      );
      expect(results.length).to.equal(call_times * repeat);
      expect(results).to.deep.equal(
        times(repeat)
          .map(() => sequence)
          .flat(),
      );

      expect(promise_called).to.equal(call_times);
      expect(cached_fn.cache_size()).to.equal(call_times);
    }
  });

  it.concurrent('raises exceptions for invalid number of args', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (i: number) => {
      promise_called++;
      await sleep(100);
      return i;
    });

    type ExtraArgs = (i: number, j: number) => Promise<number>;

    let error: Error | undefined;
    try {
      await (cached_fn as ExtraArgs)(2, 2);
    } catch (e) {
      error = e as Error;
    }

    const input_arg_length = 2;
    const required_argument_length = 1;
    expect(error).to.be.an.instanceOf(Error);
    expect(error?.message).to.equal(
      `Invalid number of arguments passed (${input_arg_length} != ${required_argument_length}) or used spread operator`,
    );

    expect(promise_called).to.equal(0);
  });

  it.concurrent('raises exceptions for spread operator', async () => {
    let promise_called = 0;
    const cached_fn = memoize_async({ ttl: 5, size: 100 }, async (...i: number[]) => {
      promise_called++;
      await sleep(100);
      return i;
    });

    let error: Error | undefined;
    try {
      await cached_fn(2);
    } catch (e) {
      error = e as Error;
    }

    const input_arg_length = 1;
    const required_argument_length = 0;
    expect(error).to.be.an.instanceOf(Error);
    expect(error?.message).to.equal(
      `Invalid number of arguments passed (${input_arg_length} != ${required_argument_length}) or used spread operator`,
    );

    expect(promise_called).to.equal(0);
  });
});
