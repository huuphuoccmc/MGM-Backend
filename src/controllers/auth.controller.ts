import { Request, Response } from "express";
const createSession = (req: Request, res: Response) => {
  if (req.session) req.session.userId = +(req.sessionID || 0);
  res.json({
    code: 0, data: { userId: +(req.sessionID || 0) }
  });
};

export default {
  createSession,
} as const;