guga
====

A simple Bitcoin 38 password brute force cracker

Installation
===

```
git clone git@github.com:cmgustavo/guga.git
```

Install modules

```
npm install
```

And enter your password combination inside the `words` file. One word by line.

```
TestingOneTwoThree
FourFiveSixSeven
EightNineTen
```

Usage
===

Generate your `privateKey` and `bitcoin address` from https://www.bitaddress.org (BIP38 Encrypt).

```
node guga.js <bitcoin-address> <private-key>
```
