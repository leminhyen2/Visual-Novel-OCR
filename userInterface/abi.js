const nodeAbi = require('node-abi')
 
//console.log(nodeAbi.getAbi('12.18.3', 'node'))// '51'
console.log(nodeAbi.getAbi('15.2.0', 'node'))
console.log(nodeAbi.getAbi('10.1.5', 'electron'))// '51'
