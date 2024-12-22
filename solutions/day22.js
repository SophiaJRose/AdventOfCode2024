export function partOne(input) {
    let secretNumbers = [];
    try {
        secretNumbers = input.trim().split("\n").map(BigInt);
        if (secretNumbers.some((x) => Number.isNaN(x))) {
            throw new Error("Input contains NaNs.");
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let sum = 0n;
        for (let num of secretNumbers) {
            for (let i = 0; i < 2000; i++) {
                let mult64 = num * 64n;
                num = mult64 ^ num;
                num = num % 16777216n;
                let div32 = BigInt(Math.floor(Number(num / 32n)));
                num = div32 ^ num;
                num = num % 16777216n;
                let mult2048 = num * 2048n;
                num = mult2048 ^ num;
                num = num % 16777216n;
            }
            console.log(num);
            sum += num;
        }
        return String(sum);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let secretNumbers = [];
    try {
        secretNumbers = input.trim().split("\n").map(BigInt);
        if (secretNumbers.some((x) => Number.isNaN(x))) {
            throw new Error("Input contains NaNs.");
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let allPrices = [];
        let allChanges = [];
        let allSeqPrices = [];
        for (let num of secretNumbers) {
            let buyerPrices = [num % 10n];
            let buyerChanges = [];
            let prevPrice = 0n;
            let buyerSeqPrices = new Map();
            let seq = [];
            for (let i = 0; i < 2000; i++) {
                let mult64 = num * 64n;
                num = mult64 ^ num;
                num = num % 16777216n;
                let div32 = BigInt(Math.floor(Number(num / 32n)));
                num = div32 ^ num;
                num = num % 16777216n;
                let mult2048 = num * 2048n;
                num = mult2048 ^ num;
                num = num % 16777216n;
                // Update changes, prices and sequences
                let price = num % 10n;
                let change = price - prevPrice;
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
                buyerChanges.push(change);
                buyerPrices.push(price);
                prevPrice = price;
            }
            allPrices.push(buyerPrices);
            allChanges.push(buyerChanges);
            allSeqPrices.push(buyerSeqPrices);
        }
        console.log("All prices and changes found");
        console.log(allSeqPrices);
        // Find sequence by brute force
        // Each change can be from -9 to +9, i.e. 17 values, seq is 4 changes, to 17^4 possible sequences
        let maxBananas = 0n;
        let maxSequence = [0n, 0n, 0n, 0n];
        for (let a = -9n; a < 10n; a++) {
            for (let b = -9n; b < 10n; b++) {
                for (let c = -9n; c < 10n; c++) {
                    for (let d = -9n; d < 10n; d++) {
                        let bananas = 0n;
                        let seq = [a, b, c, d];
                        for (let seqPrices of allSeqPrices) {
                            let sell = seqPrices.get(seq.join(","));
                            if (sell != undefined) {
                                bananas += sell;
                            }
                        }
                        console.log(`--- Seq: ${seq}, bananas: ${bananas}, maxBananas: ${maxBananas}`);
                        if (bananas > maxBananas) {
                            maxBananas = bananas;
                            maxSequence = seq.slice();
                        }
                        // let bananas: bigint = 0n
                        // let seq: bigint[] = [a,b,c,d];
                        // // For a given sequence, go through each buyers changes until sequence is matched, then add resulting bananas
                        // // Once all buyers checked, compare bananas to max bananas
                        // for (let i = 0; i < allChanges.length; i++) {
                        //     let changes = allChanges[i];
                        //     let seqFound: number = 0;
                        //     // If any element of sequence doesn't appear, skip
                        //     if (!changes.includes(a) || !changes.includes(b) || !changes.includes(c) || !changes.includes(d)) {
                        //         console.log("Skipped");
                        //         continue;
                        //     }
                        //     for (let j = 0; j < changes.length; j++) {
                        //         let change = changes[j];
                        //         if (change == seq[seqFound]) {
                        //             seqFound++;
                        //         } else {
                        //             seqFound = 0;
                        //         }
                        //         if (seqFound == 4) {
                        //             console.log(`Seq: ${seq}, bananas: ${bananas}, maxBananas: ${maxBananas}, i: ${i}, price: ${allPrices[i][j]}`);
                        //             bananas += allPrices[i][j+1];
                        //             break;
                        //         }
                        //     }
                        // }
                        // console.log(`--- Seq: ${seq}, bananas: ${bananas}, maxBananas: ${maxBananas}`)
                        // if (bananas > maxBananas) {
                        //     maxBananas = bananas;
                        //     maxSequence = seq.slice();
                        // }
                    }
                }
            }
        }
        console.log(maxSequence);
        return String(maxBananas);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
