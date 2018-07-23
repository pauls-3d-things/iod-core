export const normalizeMillis = (millis: number) => {
    let zeros = "";
    if (millis / 100 < 1) {
        zeros += "0";
    }
    if (millis / 10 < 1) {
        zeros += "0";
    }
    return zeros + millis;
};

export const printSleepString = (n: number | string | undefined) => {
    if (!n) {
        n = 0;
    }
    if (typeof (n) === "string") {
        n = 0;
    }
    const millis = normalizeMillis(n % 1000);
    const s: number | string = Math.floor(((n / 1000) % 60));
    const m: number | string = Math.floor(((n / (1000 * 60)) % 60));
    const h: number | string = Math.floor((n / (1000 * 60 * 60)));
    return h + "h " + m + "m " + s + (n % 1000 ? "." + millis : "") + "s";
};
