import { random } from 'nanoid';

const byteToHex: string[] = [];

for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
}

export const uuid4 = (): string => {
    const rnd = random(16);
    rnd[6] = (rnd[6] & 0x0f) | 0x40;
    rnd[8] = (rnd[8] & 0x3f) | 0x80;
    const result: string[] = [];
    for (let i = 0; i < rnd.length; i++) {
        result.push(byteToHex[rnd[i]]);
        if (i === 3 || i === 5 || i === 7 || i === 9) result.push('-');
    }
    return result.join('');
};
