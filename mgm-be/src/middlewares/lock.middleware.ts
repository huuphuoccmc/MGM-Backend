import lockService from "@services/lock.service";
import errors from "@shared/errors";
import { NextFunction, Request, Response } from "express";

const colLockRequire = (req: Request, res: Response, next: NextFunction) => {
    const session = {
        userId: req.session?.userId,
        tabId: req.headers.tabId ? +req.headers.tabId : undefined,
    };

    if (!lockService.isAcquireColLock(session)) {
        throw errors.LockResource;
    }
    next();
}

const colReleaseRequire = (req: Request, res: Response, next: NextFunction) => {
    if (lockService.isColLockAcquired())
        throw errors.LockResource;
    next();
}

const rowLockRequire = (req: Request, res: Response, next: NextFunction) => {
    const session = {
        userId: req.session?.userId,
        tabId: req.headers.tabId ? +req.headers.tabId : undefined,
    };

    const rowId = req.body.rowId;

    if (!lockService.isAcquireRowLock(session, rowId)) {
        throw errors.LockResource;
    }
    next();
}

export default {
    colLockRequire,
    rowLockRequire,
    colReleaseRequire,
} as const;