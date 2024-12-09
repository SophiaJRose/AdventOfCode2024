export function partOne(input: string): string {
    try {
        let nums: number[] = input.trim().split("").map(Number);
        if (nums.some((x) => Number.isNaN(x))) {
            console.log("Input contains NaNs");
            return "Error parsing input";
        }
        let blocks: string[] = [];
        let file: boolean = true;
        let id: number = 0;
        for (let num of nums) {
            if (file) {
                let newBlocks: string[] = Array(num);
                newBlocks.fill(String(id));
                blocks = blocks.concat(newBlocks);
                id++;
            } else {
                let newBlocks: string[] = Array(num);
                newBlocks.fill(".");
                blocks = blocks.concat(newBlocks);
            }
            file = !file;
        }
        let checksum: number = 0;
        let i: number = 0;
        let j: number = blocks.length-1;
        while (i <= j) {
            let iBlock: string = blocks[i];
            if (iBlock == ".") {
                let jBlock: string;
                while ((jBlock = blocks[j]) == ".") {
                    j--;
                }
                if (j < i) {
                    break;
                }
                checksum += i * Number(jBlock);
                j--;
            } else {
                checksum += i * Number(iBlock);
            }
            i++;
        }
        return String(checksum);
    } catch (err) {
        console.log(err);
        return "Error during solving"
    }
}

type FileSpace = {
    id: string,
    size: number;
}

export function partTwo(input: string): string {
    try {
        let nums: number[] = input.trim().split("").map(Number);
        if (nums.some((x) => Number.isNaN(x))) {
            console.log("Input contains NaNs");
            return "Error parsing input";
        }
        let files: FileSpace[] = [];
        let file: boolean = true;
        let id: number = 0;
        for (let num of nums) {
            if (file) {
                files.push({id: String(id), size: num})
                id++;
            } else {
                files.push({id: ".", size: num})
            }
            file = !file;
        }
        id--;
        while (id >= 0) {
            let idIndex: number = files.findIndex((obj) => obj.id == String(id));
            let idFile: FileSpace = files[idIndex];
            let emptySpaceIndex: number = files.findIndex((obj) => obj.id == "." && obj.size >= idFile.size);
            if (emptySpaceIndex == -1 || emptySpaceIndex > idIndex) {
                id--;
                continue;
            }
            let emptySpace: FileSpace = files[emptySpaceIndex];
            let remainder: number = emptySpace.size - idFile.size;
            if (remainder == 0) {
                files[idIndex] = emptySpace;
                files[emptySpaceIndex] = idFile;
            } else {
                let remainderSpace = {id: ".", size: remainder};
                files[idIndex] = {id: ".", size: idFile.size};
                files.splice(emptySpaceIndex, 1, idFile, remainderSpace);
            }
            id--;
        }
        let blocks: string[] = [];
        for (let file of files) {
            let newBlocks: string[] = Array(file.size);
            newBlocks.fill(String(file.id));
            blocks = blocks.concat(newBlocks);
        }
        let checksum: number = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i] != ".") {
                checksum += i * Number(blocks[i]);
            }
        }
        return String(checksum);
    } catch (err) {
        console.log(err);
        return "Error during solving"
    }
}