#!/usr/bin/env node

var bip38 = require('bip38');
var bitcore = require('bitcore');
var Address = bitcore.Address;
var networks = bitcore.networks;
var Bip38 = new bip38();


var addr = process.argv[2];
var epk = process.argv[3];
var a = Address.isValid(addr, 'livenet');
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

for (i in passArr) {
  var pass = passArr[i];
  console.log('Testing:', i, pass); //TODO

  try {
    var pk = Bip38.decrypt(epk, pass);
console.log('#### Encrypted PrivateKey', epk);
console.log('#### PrivateKey', pk);
    var privateKey = new bitcore.PrivateKey(pk);
    var publicKey = privateKey.toPublicKey();
    var a = publicKey.toAddress('livenet').toString();
console.log('#### Address', a);
    if (a === addr) {
      console.log('##############   FOUND Address:' + addr + ' with password:' + pass);
      process.exit(1);
    }
  } catch (e) {
    console.log('ERROR',e); //TODO
  }
}

console.log('Finished with file:' + FILE); //TODO
