# Introduction
The objective of this test is to implement a memoization utility for async js functions. This repository contains all the starter code you might need. The signature of the function is also decided for you. Your only job is to implement the [memoize_async](src/memoize.ts#L37) function in [memoize.ts](src/memoize.ts). You can learn more about memoization from [wikipedia](https://en.wikipedia.org/wiki/Memoization) or try out some [npm libraries](https://www.npmjs.com/package/memoizee)

### [index.ts](src/index.ts)
The file contains an example of where memoization might be useful. 
It shows how memoization might be useful when calculating file hashes multiple times for the same file.
You can try it out as follows.
```bash
❯ npm run build-code 

> memoize-async-test@1.0.0 build-code /home/rahul/workspace/memoize_async_test
> run-p tsc eslint


> memoize-async-test@1.0.0 eslint /home/rahul/workspace/memoize_async_test
> eslint --format unix './src/**/*.ts'


> memoize-async-test@1.0.0 tsc /home/rahul/workspace/memoize_async_test
> tsc

❯ node build/index.js 
Calculating file hash for src/memoize.ts
Calculating file hash for src/memoize.ts
Calculating file hash for src/util.ts
Calculating file hash for src/util.ts
Calculating file hash for src/index.ts
done
```
### [memoize.spec.ts](src/memoize.spec.ts)
This file has the required test that must pass to complete the test.

### [memoize.ts](src/memoize.ts)
This file has a dummy memoize function which just calls the original function. It does not pass all tests and must be correctly implemented to pass the test.

# Steps to follow:
1. Make sure node and npm is installed. Please follow the this [guide](https://nodejs.org/en/download/package-manager/)
2. Install all the required dependencies:
   ```bash
   ❯ cd memoize_async_test
   ❯ npm install
   ```
3. Implement the [memoize_async](src/memoize.ts#L37) function correctly.
4. Run the tests and make sure they all pass:
   ```bash
    ❯ npm start
    
    > memoize-async-test@1.0.0 start /home/rahul/workspace/memoize_async_test
    > run-s clean build-code test
    
    
    > memoize-async-test@1.0.0 clean /home/rahul/workspace/memoize_async_test
    > rm -rf build/
    
    
    > memoize-async-test@1.0.0 build-code /home/rahul/workspace/memoize_async_test
    > run-p tsc eslint
    
    
    > memoize-async-test@1.0.0 eslint /home/rahul/workspace/memoize_async_test
    > eslint --format unix './src/**/*.ts'
    
    
    > memoize-async-test@1.0.0 tsc /home/rahul/workspace/memoize_async_test
    > tsc
    
    
    > memoize-async-test@1.0.0 test /home/rahul/workspace/memoize_async_test
    > jest
    
    PASS  src/memoize.spec.ts
    memoize async correctly caches
    ✓ correctly caches calls in sequence (97 ms)
    ✓ correctly caches calls in parallel (100 ms)
    ✓ correctly caches calls with number args (822 ms)
    ✓ correctly limits cache size on set (1 ms)
    ✓ correctly caches calls with string args
    ✓ correctly caches calls with boolean args (99 ms)
    ✓ correctly caches calls with number args and json return (101 ms)
    ✓ correctly expires cache 1 (200 ms)
    ✓ correctly expires cache 2 (999 ms)
    ✓ correctly limits cache size
    ✓ removes the oldest cache first
    ✓ rejects all parallel error requests
    ✓ can clear cache
    ✓ correctly caches calls with multiple args (7 ms)
    ✓ raises exceptions for invalid number of args
    ✓ raises exceptions for spread operator
    
    Test Suites: 1 passed, 1 total
    Tests:       16 passed, 16 total
    Snapshots:   0 total
    Time:        4.091 s, estimated 5 s
    Ran all test suites.
   ```
5. Zip the memoize_async_test directory and submit the solution.

# Frequently Asked Questions:
#### Q. So I just have to write code that implements one function and passes all the tests in this repository. Thats it?
Yeah. Thats it.

#### Q. There is some messy typescript code used by the function. I know how to implement it, but I suck at typescript. Can I simplify it?
Go ahead. But you get triple brownie points for doing it with the required typings.

#### Q. This is too simple. I don't wanna waste my time on this.
Yes. An efficient implementation of it comes to around 150 lines of typescript code. Ofocuse there are edge cases that might not be immedietly obvious unless you try to implement it. We would still like to talk to you if you feel otherwise.

#### Q. What are you looking for when judging code quality?
A few things in order of priority.
 * Readability/Clarity - How quickly can I understand your code.
 * Efficiency - Memoization cannot be the bottleneck. Ever.
 * Complexity - Can you iterate on your final solution and make it even simpler. Reduce duplication, remove unnecessary code. Can it be made any simpler.

#### Q. Can I use any external dependencies?
Yes. But for obvious reasons you cannot use a library that implements memoization.

#### Q. Dude, people are just gonna copy code from these open source libraries.
Yes. And we would like you to try that too. Its fun to understand how the magic happens.
