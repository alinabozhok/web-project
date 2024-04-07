export function receiveData(csvText, sep = ","){

    let matrix = [];
    let csvLines = csvText.split('\n');
    let currRow;
    for (let i = 0; i < csvLines.length - 1; i++) {

        let line = csvLines[i];
        let cells = line.split(sep);
        currRow = [];
        for (let j = 0; j < cells.length; j++) {
            cells[j] = cells[j].trim();
            if (cells[j].length === 0 || cells[j] === undefined) {
                alert("Загрузите что-то....");
                return;
            }
            currRow.push(cells[j]);
        }
        matrix.push(currRow);
    }
    return matrix;
}