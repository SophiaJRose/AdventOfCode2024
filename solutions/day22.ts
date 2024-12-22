export function partOne(input: string): string {
    let secretNumbers: bigint[] = [];
    try {
        secretNumbers = input.trim().split("\n").map(BigInt);
        if (secretNumbers.some((x) => Number.isNaN(x))) {
            throw new Error("Input contains NaNs.");
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let sum: bigint = 0n;
        for (let num of secretNumbers) {
            for (let i = 0; i < 2000; i++) {
                let mult64: bigint = num * 64n;
                num = mult64 ^ num;
                num = num % 16777216n;
                let div32: bigint = BigInt(Math.floor(Number(num / 32n)));
                num = div32 ^ num;
                num = num % 16777216n;
                let mult2048: bigint = num * 2048n;
                num = mult2048 ^ num;
                num = num % 16777216n;
            }
            sum += num;
        }
        return String(sum);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

export function partTwo(input: string): string {
    let secretNumbers: bigint[] = [];
    try {
        secretNumbers = input.trim().split("\n").map(BigInt);
        if (secretNumbers.some((x) => Number.isNaN(x))) {
            throw new Error("Input contains NaNs.");
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let allPrices: bigint[][] = [];
        let allSeqPrices: Map<string, bigint>[] = [];
        // While calculating all prices, for each sequence of 4 changes, save the corresponding price to a map if it has not already occurred for that buyer
        // Then, for any particular sequence, we can find what any particular buyer will pay for that sequence
        for (let num of secretNumbers) {
            let buyerPrices: bigint[] = [num % 10n];
            let prevPrice: bigint = 0n;
            let buyerSeqPrices: Map<string, bigint> = new Map();
            let seq: bigint[] = [];
            for (let i = 0; i < 2000; i++) {
                let mult64: bigint = num * 64n;
                num = mult64 ^ num;
                num = num % 16777216n;
                let div32: bigint = BigInt(Math.floor(Number(num / 32n)));
                num = div32 ^ num;
                num = num % 16777216n;
                let mult2048: bigint = num * 2048n;
                num = mult2048 ^ num;
                num = num % 16777216n;
                // Update changes, prices and sequences
                let price: bigint = num % 10n;
                let change: bigint = price - prevPrice;
                seq.push(change);
                if (seq.length > 4) {
                    seq.shift();
                }
                if (seq.length == 4) {
                    let alreadySet = buyerSeqPrices.has(seq.join(","));
                    if (!alreadySet) {
                        buyerSeqPrices.set(seq.join(","), price);
                    }
                }
                buyerPrices.push(price);
                prevPrice = price;
            }
            allPrices.push(buyerPrices);
            allSeqPrices.push(buyerSeqPrices);
        }
        // Find sequence by brute force
        // Each change can be from -9 to +9, i.e. 17 values, seq is 4 changes, to 17^4 possible sequences
        // For each sequence, check total that each buyer pays for it from map constructed earlier
        let maxBananas: bigint = 0n;
        let maxSequence: bigint[] = [0n,0n,0n,0n];
        for (let a = -9n; a < 10n; a++) {
            for (let b = -9n; b < 10n; b++) {
                for (let c = -9n; c < 10n; c++) {
                    for (let d = -9n; d < 10n; d++) {
                        let bananas: bigint = 0n;
                        let seq: bigint[] = [a,b,c,d];
                        for (let seqPrices of allSeqPrices) {
                            let sell: bigint | undefined = seqPrices.get(seq.join(","));
                            if (sell != undefined) {
                                bananas += sell;
                            }
                        }
                        if (bananas > maxBananas) {
                            maxBananas = bananas;
                            maxSequence = seq.slice();
                        }
                    }
                }
            }
        }
        return String(maxBananas);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}