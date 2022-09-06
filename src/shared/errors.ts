export interface IErrorModel {
    code: number,
    message: string;
}

const errors = {
    Unknown: {
        code: -1,
        message: "Something went wrong",
    },
    RowNotFound: {
        code: -100,
        message: "Row Not Found",
    },
    MaxRowLevel: {
        code: -101,
        message: "Reach Limit Parent-Child Level"
    },
    LeadToOrphanRow: {
        code: -102,
        message: "Lead To Orphan Row"
    },
    InvalidRowData: {
        code: -103,
        message: "Invalid row data"
    },
    DuplicateColumnName: {
        code: -200,
        message: "Duplicate column name",
    },
    InvalidColumnName: {
        code: -201,
        message: "Invalid column name",
    },
    InvalidDataType: {
        code: -300,
        message: "Invalid Datatype",
    },
    ColumnNotFound: {
        code: -301,
        message: "Column Not Found",
    },
    LockResource: {
        code: -400,
        message: "Locking resource",
    }
} as const;

export default errors;