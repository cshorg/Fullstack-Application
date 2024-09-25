import { CONFLICT, UNAUTHORIZED } from "../constants/http"
import VerificationCodeType from "../constants/verificationCodeTypes"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import appAssert from "../utils/appAssert"
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date"
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt"

export type CreateAccountParams = {
  username: string,
  email: string,
  password: string,
  userAgent?: string
}

export const createAccount = async (data: CreateAccountParams) => {
  // verify email is not taken
  const existingUsername = await UserModel.exists({
    username: data.username,
  });
  appAssert(!existingUsername, CONFLICT, "Username already in use");

  const existingEmail = await UserModel.exists({
    username: data.email,
  });
  appAssert(!existingEmail, CONFLICT, "Email already in use");

  const user = await UserModel.create({
    username: data.username,
    email: data.email,
    password: data.password,
  });
  const userId = user._id;
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  const refreshToken = signToken({
    sessionId: session._id,
    }, refreshTokenSignOptions
  )
   
  const accessToken = signToken({
    userId,
    sessionId: session._id,
  })
  
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  username: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({
  username,
  password,
  userAgent,
}: LoginParams) => {
  const user = await UserModel.findOne({ username });
  appAssert(user, UNAUTHORIZED, "Invalid username or password");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid username or password");

  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)
  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id
  })
 
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret
  })
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token")

  const session = await SessionModel.findById(payload.sessionId)
  const now = Date.now()
  appAssert(session
    && session.expiresAt.getTime() > now, 
    UNAUTHORIZED, "Session expired")

  // refreshing session if it expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow()
    await session.save()
  }

  const newRefreshToken = sessionNeedsRefresh ? signToken({
    sessionId: session._id
  }, refreshTokenSignOptions) : undefined

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
}