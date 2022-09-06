
export interface IRecordModel {
    data: any;
    children: IRecordModel[];
}
export default interface IRecord {
    data: any;
    children: number[];
    nextId?: number,
    previousId?: number,
    parentId?: number,
    level: number,
}