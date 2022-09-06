import { DataType } from "./data-type.interface";

export default interface IColumnInfo {
    columnName: string;
    dataType: DataType;
    defaultValue: any;
    mandatory: boolean;
    ddlValues?: string[];
}
