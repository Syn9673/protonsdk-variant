# VarList
 The ProtonSDK Variant code done in Javascript to create or decode packets for games/servers that use ProtonSDK

## Examples
 Creating a Variant Packet  
```js
const { Variant } = require("variant");
const varlist = new Variant(); // create a new instance of Variant class

const packetData = varlist.call("OnConsoleMessage", "Hello"); // creates a packet and returns it along with the new data
/* Packet Data:
{
  type: 4,
  packetType: 1,
  netID: -1,
  state: 8,
  delay: 0,
  argsCount: 2,
  args: [ 'OnConsoleMessage', 'Hello' ],
  packet: <Buffer 04 00 00 00 01 00 00 00 ff ff ff ff 00 00 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 44 more bytes>
}*/
```  

 Converting a Buffer to Variant Class  
```js
const { Variant } = require("variant");
const varlist = Variant.from("0400000001000000ffffffff000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000020002100000004f6e436f6e736f6c654d65737361676501020500000048656c6c6f"); // returns a new instance of the Variant class containing the decoded data

/* Packet Data: 
{
  type: 4,
  packetType: 1,
  netID: -1,
  state: 8,
  delay: 0,
  argsCount: 2,
  args: [ 'OnConsoleMessage', 'Hello' ],
  packet: <Buffer 04 00 00 00 01 00 00 00 ff ff ff ff 00 00 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 44 more bytes>
}*/
```