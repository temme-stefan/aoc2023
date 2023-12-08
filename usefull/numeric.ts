export const ggT = (a: number, b: number) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

export const kgV = (a: number, b: number) => a != 0 && b != 0 ? Math.abs(a) * (Math.abs(b) / ggT(a, b)) : 0