import { fiveMinutesAgo, oneHourFromNow } from './../utils/date';
import { APP_ORIGIN } from "../constants/env"
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/http"
import VerificationCodeType from "../constants/verificationCodeTypes"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import appAssert from "../utils/appAssert"
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date"
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates"
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt"
import { sendMail } from "../utils/sendMail"
import { hashValue } from '../utils/bcrypt';

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

  // verification url
  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`

  // send verification email
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url)
  })

  if (error) console.log(error)

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

export const verifyEmail = async (code: string) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date()}
  })
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code")

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId, {
      verified: true
    },
    {new: true}
  )
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email")

  await validCode.deleteOne()

  return {
    user: updatedUser.omitPassword()
  }
}

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email })
    appAssert(user, NOT_FOUND, "User not found")

    // check for max password reset requests (2 emails in 5min)
    const fiveMinAgo = fiveMinutesAgo();
    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgo },
    })
    appAssert(
      count <= 1,
      TOO_MANY_REQUESTS,
      "Too many requests, please try again later"
    )

    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt,
    })

    const url = `${APP_ORIGIN}/password/reset?code=${
      verificationCode._id
    }&exp=${expiresAt.getTime()}`

    const { data, error } = await sendMail({
      to: email,
      ...getPasswordResetTemplate(url),
    })

    appAssert(
      data?.id,
      INTERNAL_SERVER_ERROR,
      `${error?.name} - ${error?.message}`
    )
    return {
      url,
      emailId: data.id,
    }
  } catch (error: any) {
    console.log("SendPasswordResetError:", error.message)
    return {}
  }
}

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({ verificationCode, password }: ResetPasswordParams) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  })
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code")

  // update user password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  })
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password")

  // remove verification code
  await validCode.deleteOne()

  // delete all sessions
  await SessionModel.deleteMany({ userId: validCode.userId })

  return { user: updatedUser.omitPassword() }
};