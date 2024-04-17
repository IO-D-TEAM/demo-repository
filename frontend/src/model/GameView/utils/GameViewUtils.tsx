import { FieldType } from "../../../interfaces/GameViewInterfaces/FieldType";


const calculateRowsAndCols = (size: number): [number, number] => {
    let rows: number = Math.ceil(Math.sqrt(size / 3));
    let columns: number = 3 * rows;

    if (size % 3 !== 0) {
        columns = 3 * rows;
    }

    rows += (rows - 1);
    return [rows, columns];
}


const calculateFields = (size: number, speciality: string[]): [FieldType[], number, number] => {
    let [rows, columns] = calculateRowsAndCols(size);
    const fields: FieldType[] = [];

    let position: number = 0;
    let goRight: boolean = true;

    for (let row = 0; row < rows; row++) {
        if (row % 2 === 0) {
            if (goRight) {
                for (let col = 0; col < columns; col++) {
                    if (size === position) break;
                    fields.push({
                        position: position,
                        row: row + 1,
                        column: col + 1,
                        speciality: speciality[position]
                    });
                    position++;
                }
                goRight = false;
            } else {
                for (let col = columns - 1; col > -1; col--) {
                    if (size === position) break;
                    fields.push({
                        position: position,
                        row: row + 1,
                        column: col + 1,
                        speciality: speciality[position]
                    });
                    position++;
                }
                goRight = true;
            }
        } else {
            if (size === position) break;
            if (goRight) {
                fields.push({
                    position: position,
                    row: row + 1,
                    column: 0,
                    speciality: speciality[position]
                });
            } else {
                fields.push({
                    position: position,
                    row: row + 1,
                    column: columns,
                    speciality: speciality[position]
                });
            }
            position++;
        }
    }

    if (fields[fields.length - 1].row < rows) {
        rows = fields[fields.length - 1].row;
    }

    return [fields, rows, columns];
}


export { calculateFields }