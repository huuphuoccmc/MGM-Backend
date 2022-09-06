import IColumnInfo from "@interfaces/column.interface";
import errors from "@shared/errors";

let columns: Map<string, IColumnInfo> = new Map();

const PRIMARY_NAME = "RowID";
const isPrimary = (col: IColumnInfo) => col.columnName === PRIMARY_NAME;
const loadColumn = (data: IColumnInfo[]) => {
    data.forEach(col => columns.set(col.columnName, col));
};

const getColumns = () => [...columns.values()];

const getColumn = columns.get;

const addColumn = (col: IColumnInfo) => {
    if (columns.has(col.columnName)) {
        throw errors.DuplicateColumnName;
    }
    columns.set(col.columnName, col);
}

const editColumn = (oldColumnName: string, newColumn: IColumnInfo) => {
    const oldColumn = getColumn(oldColumnName);
    if (!oldColumn || isPrimary(oldColumn))
        throw errors.InvalidColumnName;
    if (oldColumnName !== newColumn.columnName && columns.has(newColumn.columnName)) {
        throw errors.DuplicateColumnName;
    }
    if (oldColumnName !== newColumn.columnName) {
        columns.delete(oldColumnName);
    }
    columns.set(newColumn.columnName, newColumn);
    return oldColumn;
}

const deleteColumn = (columnName: string) => {
    const column = columns.get(columnName);
    if(!column)
        throw errors.ColumnNotFound;
    if (isPrimary(column)) {
        throw errors.InvalidColumnName;
    }
    columns.delete(columnName);
}

export default {
    getColumn,
    getColumns,
    addColumn,
    editColumn,
    loadColumn,
    isPrimary,
    deleteColumn,
} as const;