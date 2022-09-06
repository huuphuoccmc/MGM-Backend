import IColumnInfo from "@interfaces/column.interface";
import { DataType } from "@interfaces/data-type.interface";
import errors from "@shared/errors";
import moment from "moment";

const DATE_FORMAT = "YYYY/MM/DD";
const castFunctions = {
    [DataType.Text]: (value: any, defaultValue?: any) => {
        return value ? value.toString() : defaultValue;
    },
    [DataType.Bool]: (value: any, defaultValue?: any) => {
        return Boolean(value);
    },
    [DataType.Num]: (value: any, defaultValue?: any) => {
        if (/^-?\d+\.?\d*$/.test(value)) return +value;
        return defaultValue;
    },
    [DataType.Date]: (value: any, defaultValue?: any) => {
        const date = moment(value, DATE_FORMAT, true);
        return date.isValid() ? date.format(DATE_FORMAT) : defaultValue;
    },
    [DataType.Enum]: (value: any, defaultValue: any, ddlValues?: string[]) => {
        if(!ddlValues)
            ddlValues = [];
        if (typeof value == "undefined") {
            return defaultValue;
        };
        if (ddlValues.includes(value))
            return value;
        const result = value.toString();
        ddlValues.push(result);
        return result;
    }
}

const validateFunctions = {
    [DataType.Text]: () => { },
    [DataType.Bool]: (value: any) => {
        if (typeof value !== "boolean")
            throw errors.InvalidRowData;
    },
    [DataType.Num]: (value: any) => {
        if (!/^-?\d+\.?\d*$/.test(value))
            throw errors.InvalidRowData;
    },
    [DataType.Date]: (value: any) => {
        if (!moment(value, DATE_FORMAT, true).isValid())
            throw errors.InvalidRowData;
    },
    [DataType.Enum]: (value: any, ddlValues?: string[]) => {
        if (!ddlValues || !ddlValues.includes(value))
            throw errors.InvalidRowData;
    }
}

const castData = (column: IColumnInfo, value: any) => {
    const func = castFunctions[column.dataType];
    return func(value, column.defaultValue, column.ddlValues);
}

const validateData = (column: IColumnInfo, value: any) => {
    const func = validateFunctions[column.dataType];
    return func(value, column.ddlValues);
}

const isValidDataType = (name: string, ddlValues?: string[]) => {
    if(name == DataType.Enum)
        return Boolean(ddlValues);
    return name in DataType;
};

export default {
    castData,
    validateData,
    isValidDataType,
} as const;