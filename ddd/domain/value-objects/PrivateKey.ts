
// The secret key required to spend funds from an address.

export class PrivateKey {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }

    toUint8Array(): Uint8Array {
        const hex = this.value.replace('0x', '');
        return new Uint8Array(
        hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
        );
    }
}