import IColumnInfo from "@interfaces/column.interface";
import IRecord, { IRecordModel } from "@interfaces/record.interface";
import errors from "@shared/errors";

const MAX_LEVEL = 3;
const rowMap = new Map<number, IRecord>();
let rowHeadId = 0;
let maxRowId = 0;

const loadRow = (data: any[], level: number = 1, parentId?: number) => {
    data.forEach((e: any, index: number) => {
        rowMap.set(e.data.RowID, {
            data: e.data,
            children: e.children ? e.children.map((child: any) => child.data.RowID) : [],
            previousId: data[index - 1]?.data?.RowID,
            nextId: data[index + 1]?.data?.RowID,
            parentId,
            level,
        });
        if (e.children)
            loadRow(e.children, level + 1, e.data.RowID);
    });
}

const loadConfig = (maxId: number, headId: number) => {
    rowHeadId = headId;
    maxRowId = maxId;
}

const getMaxRowId = () => maxRowId;
const getRowHeadId = () => rowHeadId;

const getRow = (rowId: number): IRecord => {
    const rowData = rowMap.get(rowId);
    if (!rowData) {
        throw errors.RowNotFound;
    }
    return rowData;
}

const getRowData = (rowId: number): IRecordModel => {
    const row = getRow(rowId);
    return {
        data: row.data,
        children: row.children.map((childId: number) => getRowData(childId)),
    };
}

const getRowsData = (startRowId: number = rowHeadId, limit: number = Infinity): IRecordModel[] => {
    let row = getRow(startRowId);
    const result = [getRowData(startRowId)];

    let count = 1;
    while (row.nextId && count < limit) {
        result.push(getRowData(row.nextId));
        row = getRow(row.nextId);
        count++;
    };

    return result;
}

const addNext = (rowId: number, data: Record<string, any>, isNewRow: boolean = true) => {
    const row = getRow(rowId);
    const newRow: IRecord = {
        data,
        children: [],
        level: row.level,
    };
    if (isNewRow) newRow.data.RowID = ++maxRowId;
    if (row.nextId) {
        const nextRow = getRow(row.nextId);
        newRow.nextId = row.nextId
        nextRow.previousId = newRow.data.RowID;
    }
    if (row.parentId) {
        const parentRow = getRow(row.parentId);
        newRow.parentId = parentRow.data.RowID;
        parentRow.children.splice(parentRow.children.indexOf(row.data.RowID) + 1, 0, newRow.data.RowID);
    }
    newRow.level = row.level;
    newRow.previousId = row.data.RowID;
    row.nextId = newRow.data.RowID;
    rowMap.set(newRow.data.RowID, newRow);
    return newRow.data.RowID;
}
const addChild = (rowId: number, data: Record<string, any>, isNewRow: boolean = true) => {
    const row = getRow(rowId);
    if (row.level + 1 > MAX_LEVEL) {
        throw errors.MaxRowLevel;
    }
    if (row.children && row.children[0]) {
        return addNext(row.children[row.children.length - 1], data, isNewRow);
    }
    const newRow: IRecord = {
        data,
        children: [],
        level: row.level + 1,
    };
    if (isNewRow) newRow.data.RowID = ++maxRowId;
    newRow.parentId = rowId;
    row.children.push(newRow.data.RowID);
    rowMap.set(newRow.data.RowID, newRow);
    return newRow.data.RowID;
}

const removeRow = (rowId: number) => {
    const row = getRow(rowId);
    if (row.children && row.children.length !== 0)
        throw errors.LeadToOrphanRow;

    if (row.nextId) {
        getRow(row.nextId).previousId = row.previousId;
    }

    if (row.previousId) {
        getRow(row.previousId).nextId = row.nextId;
    }

    if (row.parentId) {
        const parentRow = getRow(row.parentId);
        parentRow.children.splice(parentRow.children.indexOf(rowId), 1);
    }

    if (rowId === rowHeadId && row.nextId) {
        rowHeadId = row.nextId;
    }
    rowMap.delete(rowId);
}

const moveAsChild = (rowId: number, parentId: number) => {
    const parent = getRow(parentId);
    if (parent.level === MAX_LEVEL) throw errors.MaxRowLevel;

    const row = getRow(rowId);
    removeRow(rowId);
    addChild(parentId, row.data, false);
}

const moveAsNext = (rowId: number, previousId: number) => {
    getRow(previousId);
    const row = getRow(rowId);
    removeRow(rowId);
    addNext(previousId, row.data, false);
}

const editRow = (data: Record<string, any>) => {
    const row = getRow(data.RowID);
    row.data = { ...data };
}

const validateRowData = (data: Record<string, any>, columns: IColumnInfo[], validateData: (columnInfo: IColumnInfo, value: any) => void) => {
    columns.forEach(col => {
        validateData(col, data[col.columnName]);
    });
    Object.keys(data).map(key => {
        if (!columns.find(col => col.columnName === key))
            throw errors.InvalidRowData;
    });
}

const onAddColumn = (column: IColumnInfo) => {
    [...rowMap.values()].forEach(row => row.data[column.columnName] = column.defaultValue);
}

const onUpdateColumn = (oldColumn: IColumnInfo, newColumn: IColumnInfo, castData: (columnInfo: IColumnInfo, value: any) => any) => {
    const isChangeColumnName = oldColumn.columnName != newColumn.columnName;
    const isChangeDataType = oldColumn.dataType != newColumn.dataType;
    if (isChangeColumnName || isChangeDataType) {
        [...rowMap.values()].forEach(row => {
            row.data[newColumn.columnName] = isChangeDataType ? castData(newColumn, row.data[oldColumn.columnName]) : row.data[oldColumn.columnName];
            if (isChangeColumnName) {
                delete row.data[oldColumn.columnName];
            }
        })
    }
}

const onDeleteColumn = (columnName: string) => {
    [...rowMap.values()].forEach(row => {
        delete row.data[columnName];
    });
}

export default {
    loadRow,
    loadConfig,
    getMaxRowId,
    getRowHeadId,
    getRowData,
    getRowsData,
    addNext,
    addChild,
    removeRow,
    moveAsChild,
    moveAsNext,
    validateRowData,
    onAddColumn,
    onUpdateColumn,
    onDeleteColumn,
    editRow,
} as const;