import columnService from "@services/column.service";
import dataTypeService from "@services/data-type.service";
import rowService from "@services/row.service";
import { Request, Response } from "express";

const validateRecord = (record: any) => 
    rowService.validateRowData(record, columnService.getColumns().filter(col => !columnService.isPrimary(col)), dataTypeService.validateData);
const getRowsData = (req: Request, res: Response) => {
    const lastRowId = req.query.lastRowId ? +req.query.lastRowId : undefined;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;

    const records = rowService.getRowsData(lastRowId, pageSize);
    res.json({ code: 0, data: records });
};
const addNextRow = (req: Request, res: Response) => {
    const { rowId, record } = req.body;
    validateRecord(record);
    const id = rowService.addNext(rowId, record);
    res.send({ code: 0, data: { rowId: id } });
};
const addChildRow = (req: Request, res: Response) => {
    const { rowId, record } = req.body;
    validateRecord(record);
    const id = rowService.addChild(rowId, record);
    res.send({ code: 0, data: { rowId: id } });
};
const editRow = (req: Request, res: Response) => {
    const { record } = req.body;
    validateRecord(record);
    rowService.editRow(record);
    res.send({ code: 0, message: "Success" });
};
const moveRowAsNext = (req: Request, res: Response) => {
    const { rowId, previousRowId } = req.body;
    rowService.moveAsNext(rowId, previousRowId);
    res.send({ code: 0, message: "Success" });
};
const moveRowAsChild = (req: Request, res: Response) => {
    const { parentId, rowId } = req.body;
    rowService.moveAsChild(rowId, parentId);
    res.send({ code: 0, message: "Success" });
};

const deleteRow = (req: Request, res: Response) => {
    const { rowId } = req.body;
    rowService.removeRow(rowId);
    res.send({ code: 0, message: "Success" });
};

export default {
    getRowsData,
    addNextRow,
    addChildRow,
    editRow,
    moveRowAsChild,
    moveRowAsNext,
    deleteRow,
} as const;