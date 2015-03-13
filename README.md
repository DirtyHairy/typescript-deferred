# What is it?

Typescript-Deferred is a tiny Promises/A+ compliant promise implementation in Typescript.

# How to use it?

More documentation will come when I find time, but a look at the interfaces in
`tsd.ts` and at `test_hardness.js` should get you going.

# Are there tests?

Typescript-Deferred passes the complete Promises/A+ testsuite. Compile the source
via

    tsc -m commonjs tsd.ts

and then launch the test suite via

    promises-aplus-tests test_harness.js

(you did install the testsuite via `npm install -g promises-aplus-tests`, didn't you?).

# Can I reuse this?

You like typescript-deferred? Awesome, go ahead, the code is available under the
MIT license.
