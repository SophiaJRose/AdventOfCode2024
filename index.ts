async function loadSolutions() {
    let solutionsList = <HTMLElement>document.getElementById("solutions-list");
    let solutionTemplate = <HTMLElement>document.getElementById("solution-template");
    for (let i: number = 1; i < 26; i++) {
        try {
            let solutionScript = await import("./solutions/day" + i + ".js");
            let solutionEntry = <HTMLElement>solutionTemplate.cloneNode(true);
            let entryChildren = solutionEntry.children;
            let dayLabel = entryChildren[0];
            dayLabel.textContent = "Day " + i;
            let fileInput = <HTMLInputElement>entryChildren[1];
            let part1Button = <HTMLInputElement>entryChildren[2];
            let part1Output = entryChildren[3];
            let part2Button = <HTMLInputElement>entryChildren[4];
            let part2Output = entryChildren[5];
            let input: string = "";
            fileInput.addEventListener("input", function(){
                if (fileInput.value == "") {
                    part1Button.disabled = true;
                    part2Button.disabled = true;
                } else {
                    let file: File = (<FileList>fileInput.files)[0];
                    file.text;
                    let fileReader: FileReader = new FileReader();
                    fileReader.readAsText(file);
                    fileReader.onload = (event) => {
                        input = <string>fileReader.result;
                    }
                    part1Button.disabled = false;
                    part2Button.disabled = false;
                }
            });
            part1Button.addEventListener("click", function(){
                part1Output.textContent = solutionScript.partOne(input);
            })
            part2Button.addEventListener("click", function(){
                part2Output.textContent = solutionScript.partTwo(input);
            })
            solutionsList.insertAdjacentElement("beforeend", solutionEntry);
        } catch (err) {
            console.log(err);
            console.log("Solution for day " + i + " not found");
        }
    }
}


loadSolutions();