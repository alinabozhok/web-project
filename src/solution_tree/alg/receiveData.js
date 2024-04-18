export function receiveData(csvText, sep = ",") {
    const matrix = [];
    const csvLines = csvText.split(/\r?\n/);
    for (let i = 0; i < csvLines.length; i++) {
        const line = csvLines[i].trim();
        if (line.length === 0) {
            continue; // Пропускаем пустые строки
        }
        const cells = line.split(sep);
        const currRow = cells.map(cell => cell.trim());
        if (currRow.some(cell => cell.length === 0)) {
            alert("Загрузите что-то....");
            return;
        }
        matrix.push(currRow);
    }
    return matrix;
}
