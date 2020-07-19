class Variant {
    constructor(data = null) {
        this.setup(data);
    }

    setup(data = null) {
        if (!data)
            data = {
                type: 0,
                packetType: 0,
                netID: -1,
                state: 0,
                delay: 0,
                argsCount: 0,
                args: [],
                packet: null
            }

        for (let prop in data)
            this[prop] = data[prop]
    }

    static from(packet) {
        const argsCount = packet[60];
        const args = [];
    
        let pos = 60;
        pos += 2;
    
        for (let i = 0; i < argsCount; i++) {
            switch(packet[pos]) {
                case 0x2: { // string
                    pos++;            
                    let length = packet.readUInt32LE(pos);
                    pos += 4;
        
                    let str = packet.toString("utf-8", pos, pos + length);
                    pos += length + 1;
                    args.push(str);
                    break;
                }
    
                case 0x5: { // unsigned int
                    pos++;
                    args.push(packet.readUInt32LE(pos));
                    pos += 5;
                    break;
                }
    
                case 0x9: { // signed int
                    pos++;
                    args.push(packet.readInt32LE(pos));
                    pos += 5;
                    break;
                }

                case 0x1: { // 1 float
                    pos++;
                    args.push([packet.readFloatLE(pos)]);
                    pos += 5;

                    break;
                }

                case 0x3: { // 2 floats
                    const arr = [];
                    pos++;

                    arr.push(packet.readFloatLE(pos));
                    pos += 4;
                    arr.push(packet.readFloatLE(pos));
                    pos += 4;

                    args.push(arr);

                    pos++;
                    break;
                }

                case 0x4: { // 3 floats
                    const arr = [];
                    pos++;

                    arr.push(packet.readFloatLE(pos));
                    pos += 4;
                    arr.push(packet.readFloatLE(pos));
                    pos += 4;
                    arr.push(packet.readFloatLE(pos));
                    pos += 4;

                    args.push(arr);

                    pos++;
                    
                    break;
                }
            }
        }
    
        return new Variant({
            type: packet.readUInt32LE(),
            packetType: packet.readUInt32LE(4),
            netID: packet.readInt32LE(8),
            state: packet.readUInt32LE(16),
            delay: packet.readUInt32LE(24),
            argsCount,
            args,
            packet
        });
    }

    call(options = {}, ...args) {
        let allocate = 61;

        if (typeof options === "string" || typeof options === "number")
            args.unshift(options);

        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === "string")
                allocate += args[i].length + 6;
            else if (typeof args[i] === "number")
                allocate += 6;
            else if (typeof args[i] === "object" && Array.isArray(args[i]))
                allocate += (4 * args[i].length) + 2;
        }

        const packet = Buffer.alloc(allocate);
        packet.writeUInt32LE(4); // type
        packet.writeUInt32LE(1, 4); // packet type
        packet.writeInt32LE(options.netID ?? -1, 8);
        packet.writeUInt32LE(8, 16);
        packet.writeUInt32LE(options.delay ?? 0, 24);

        packet[60] = args.length;
    
        let pos = 61;
        for (let i = 0; i < args.length; i++) {
            packet[pos] = i;
        
            switch(typeof args[i]) {
                case "string": {
                    pos++;
                    packet[pos] = 0x2;

                    pos++;
                    packet.writeUInt32LE(args[i].length, pos);

                    pos += 4;
                    packet.write(args[i], pos);

                    pos += args[i].length;
                    break;
                }

                case "number": {
                    if (!Number.isInteger(args[i]))
                        break;

                    pos++;
                    packet[pos] = args[i] < 0 ? 0x9 : 0x5;

                    pos++;
                    packet[args[i] < 0 ? "writeInt32LE" : "writeUInt32LE"](args[i], pos);

                    pos += 4;
                    break;
                }

                case "object": {
                    if (!Array.isArray(args[i]))
                        break;

                    pos++;

                    if (args[i].length === 1)
                        packet[pos] = 0x1;
                    else if (args[i].length === 2)
                        packet[pos] = 0x3;
                    else if (args[i].length === 3)
                        packet[pos] = 0x4;

                    if (!packet[pos])
                        break;

                    pos++;
                    
                    for (let c = 0; c < args[i].length; c++) {
                        packet.writeFloatLE(args[i][c], pos);
                        pos += 4;
                    }
                    break;
                }
            }
        }

        return {
            type: 4,
            packetType: 1,
            netID: options.netID ?? -1,
            state: 8,
            delay: options.delay ?? 0,
            argsCount: args.length,
            args,
            packet
        };
    }
}

module.exports = { Variant };