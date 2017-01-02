#!/usr/bin/env node

var bitcore = require('bitcore');
var Address = bitcore.Address;
var networks = bitcore.networks;

var NETWORK = 'livenet';

var addr = process.argv[2];
var epk = process.argv[3];
var a = Address.isValid(addr, NETWORK);
if (!addr || !a || !epk) {
  console.log("Usage: guga.js address privateKey(WIF)");
  process.exit(1);
}
var fs = require('fs');
var FILE = 'words';
try {
  var passArr = fs.readFileSync(FILE).toString().split("\n");
} catch (e) {
  console.log('Could not open ' + FILE + ' file:', e); //TODO
  process.exit(1);
}

function checkPrivateKey(privateKey) {
  try {
    new bitcore.PrivateKey(privateKey, NETWORK);
  } catch (err) {
    return false;
  }
  return true;
};

function getPrivateKey(encryptedPrivateKeyBase58, passphrase, opts, cb) {
  var Bip38 = require('bip38');
  var bip38 = new Bip38();

  var privateKeyWif;
  try {
    privateKeyWif = bip38.decrypt(encryptedPrivateKeyBase58, passphrase);
  } catch (ex) {
    return cb(new Error('Could not decrypt BIP38 private key', ex));
  }

  var privateKey = new bitcore.PrivateKey(privateKeyWif);
  var address = privateKey.publicKey.toAddress().toString();
  if (address === addr) {
    console.log('##### Addresses OK',address); //TODO
  }
  var addrBuff = new Buffer(address, 'ascii');
  var actualChecksum = bitcore.crypto.Hash.sha256sha256(addrBuff).toString('hex').substring(0, 8);
  var expectedChecksum = bitcore.encoding.Base58Check.decode(encryptedPrivateKeyBase58).toString('hex').substring(6, 14);
  if (actualChecksum === expectedChecksum) {
    console.log('##### Checksum OK',actualChecksum); //TODO
  }

  if (actualChecksum != expectedChecksum)
    return cb(new Error('Incorrect passphrase'));

  return cb(null, privateKeyWif);
};

for (i in passArr) {
  var pass = passArr[i];
  console.log('***** Testing:', i, pass); //TODO

  getPrivateKey(epk, pass, null, function(err, privateKey) {
    if (err) {
      console.log('----- ' + err);
      return;
    }
    if (checkPrivateKey(privateKey)) {
      console.log('########## Passwork OK: ' + pass + ' ##########'); //TODO
      process.exit(1);
    }
  });
  
}

console.log('Finished with file:' + FILE); //TODO
