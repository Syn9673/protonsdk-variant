interface PacketData {
    type: number;
    packetType: number;
    state: number;
    delay: number;
    argsCount: number;
    args: (string|number|number[])[];
    packet: Buffer;
}

interface CallOptions {
    netID: number;
    delay: number;
}

/**
 * The Variant class.
 */
declare class Variant {
    public type: number;
    public packetType: number;
    public state: number;
    public delay: number;
    public argsCount: number;
    public args: (string|number|number[])[];
    public packet: Buffer;

    /**
     * Creates a new instance of the Variant Class. Do not add anything to the `data` parameter, best leave it empty.
     * @param {PacketData} [data=null] The data to add to the class.
     */
    constructor(data?: PacketData | null);

    /**
     * Converts a Buffer packet to a Variant Class.
     * @param packet The packet data to convert to a Variant class.
     * @example
     * Variant.from("0400000001000000ffffffff000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000020002100000004f6e436f6e736f6c654d65737361676501020500000048656c6c6f"); // Will convert this valid packet to a Variant class
     */
    public static from(packet: Buffer): Variant


    /**
     * Creates a Variant Packet.
     * @param {CallOptions} [options] Omittable options for creating packets.
     * @param {number} [options.netID=-1] The net id to use in the packet.
     * @param {number} [options.delay=0] The delay to use in the packet, measured in ms.
     * @param args The arguments for the packet. Must be strings and numbers only.
     * @example
     * const variant = new Variant();
     * variant.call("OnConsoleMessage", "Hello!"); // call without netID and delay options
     * variant.call({ netID: 1, delay: 1000 }, "OnConsoleMessage", "Hello!"); // call with the options
     */
    public call(options?: CallOptions | string, ...args: (string|number|number[])[]): PacketData
}

export { Variant };