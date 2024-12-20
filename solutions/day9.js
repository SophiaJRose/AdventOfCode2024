export function partOne(input) {
    try {
        let nums = input.trim().split("").map(Number);
        if (nums.some((x) => Number.isNaN(x))) {
            console.log("Input contains NaNs");
            return "Error parsing input";
        }
        let blocks = [];
        let file = true;
        let id = 0;
        for (let num of nums) {
            if (file) {
                let newBlocks = Array(num);
                newBlocks.fill(String(id));
                blocks = blocks.concat(newBlocks);
                id++;
            }
            else {
                let newBlocks = Array(num);
                newBlocks.fill(".");
                blocks = blocks.concat(newBlocks);
            }
            file = !file;
        }
        let checksum = 0;
        let i = 0;
        let j = blocks.length - 1;
        while (i <= j) {
            let iBlock = blocks[i];
            if (iBlock == ".") {
                let jBlock;
                while ((jBlock = blocks[j]) == ".") {
                    j--;
                }
                if (j < i) {
                    break;
                }
                checksum += i * Number(jBlock);
                j--;
            }
            else {
                checksum += i * Number(iBlock);
            }
            i++;
        }
        return String(checksum);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    try {
        let nums = input.trim().split("").map(Number);
        if (nums.some((x) => Number.isNaN(x))) {
            console.log("Input contains NaNs");
            return "Error parsing input";
        }
        let files = [];
        let file = true;
        let id = 0;
        for (let num of nums) {
            if (file) {
                files.push({ id: String(id), size: num });
                id++;
            }
            else {
                files.push({ id: ".", size: num });
            }
            file = !file;
        }
        id--;
        while (id >= 0) {
            let idIndex = files.findIndex((obj) => obj.id == String(id));
            let idFile = files[idIndex];
            let emptySpaceIndex = files.findIndex((obj) => obj.id == "." && obj.size >= idFile.size);
            if (emptySpaceIndex == -1 || emptySpaceIndex > idIndex) {
                id--;
                continue;
            }
            let emptySpace = files[emptySpaceIndex];
            let remainder = emptySpace.size - idFile.size;
            if (remainder == 0) {
                files[idIndex] = emptySpace;
                files[emptySpaceIndex] = idFile;
            }
            else {
                let remainderSpace = { id: ".", size: remainder };
                files[idIndex] = { id: ".", size: idFile.size };
                files.splice(emptySpaceIndex, 1, idFile, remainderSpace);
            }
            id--;
        }
        let blocks = [];
        for (let file of files) {
            let newBlocks = Array(file.size);
            newBlocks.fill(String(file.id));
            blocks = blocks.concat(newBlocks);
        }
        let checksum = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i] != ".") {
                checksum += i * Number(blocks[i]);
            }
        }
        return String(checksum);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
