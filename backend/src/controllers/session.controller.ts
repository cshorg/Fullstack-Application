import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { z } from 'zod'

export const getSessionsHandler = catchErrors( async (req, res) => {
  const session = await SessionModel.find({
      userId: req.userId,
      expiresAt: { $gt: new Date()}
    }, {
      _id: 1,
      userAgent: 1,
      createdAt: 1
    },
    {
      sort: { createdAt: -1 }
    }
  )

  // Mapping over each session and converting to object. Then checking if session is the current user session to add isCurrent to object.
  return res.status(OK).json(
    session.map((session) => ({
      ...session.toObject(),
      ...( session.id === req.sessionId && {
        isCurrent: true
      })
    }))
  )
})

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");
  
  return res.status(OK).json({ message: "Session removed" });
});