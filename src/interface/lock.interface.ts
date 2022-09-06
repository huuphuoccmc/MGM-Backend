import IUserSession from "./user-session.interface";

export default interface ILock {
    info?: IUserSession;
    timeout?: NodeJS.Timeout;
    isAcquired(): boolean; 
    lock(info: IUserSession, options?: any): void;
    release(): void;
    compare(userId: number, tabId: number): boolean;
}