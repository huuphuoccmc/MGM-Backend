import IUserSession from "@interfaces/user-session.interface";
import errors from "@shared/errors";

const LOCK_TIMEOUT = 30000;

let colLock: IUserSession | undefined;
let colLockTimeout: NodeJS.Timeout | undefined;
let rowLocks = new Map<number, IUserSession>();
let rowLockTimeouts = new Map<number, NodeJS.Timeout>();

const acquireColLock = (session: IUserSession, onRealease?: () => void) => {
    if (colLock) throw errors.LockResource;
    colLock = session;
    colLockTimeout = setTimeout(() => {
        colLock = undefined;
        if (onRealease) onRealease();
    }, LOCK_TIMEOUT);
};

const releaseColLock = (session: IUserSession) => {
    if (!colLock) return;
    if (colLock.tabId !== session.tabId || colLock.userId !== session.tabId)
        throw errors.LockResource;
    colLock = undefined;
    clearTimeout(colLockTimeout);
};

const acquireRowLock = (
    session: IUserSession,
    rowId: number,
    onRealease?: () => void
) => {
    if (rowLocks.has(rowId)) throw errors.LockResource;
    rowLocks.set(rowId, session);
    rowLockTimeouts.set(
        rowId,
        setTimeout(() => {
            rowLocks.delete(rowId);
            if (onRealease) onRealease();
        }, LOCK_TIMEOUT)
    );
};

const releaseRowLock = (session: IUserSession, rowId: number) => {
    if (!rowLocks.has(rowId)) return;
    const rowLock = rowLocks.get(rowId);
    if (rowLock?.tabId !== session.tabId || rowLock?.userId !== session.userId)
        throw errors.LockResource;
    rowLocks.delete(rowId);
    clearTimeout(rowLockTimeouts.get(rowId));
};

const isAcquireColLock = (session: IUserSession) => (colLock?.tabId === session.tabId && colLock?.userId === session.userId);
const isAcquireRowLock = (session: IUserSession, rowId: number) => {
    const rowLock = rowLocks.get(rowId);
    return rowLock ? rowLock.tabId === session.tabId && rowLock.userId === session.userId: false;
}
const isColLockAcquired = () => colLock !== undefined;

export default {
    acquireColLock,
    releaseColLock,
    acquireRowLock,
    releaseRowLock,
    isAcquireColLock,
    isAcquireRowLock,
    isColLockAcquired,
} as const;
