import { v4 as uuidv4 } from 'uuid'
import UserAgent from 'user-agents'
import { getUserAgent } from 'universal-user-agent'
import mongoose from 'mongoose'

import EmailVerificationModel from '../models/EmailVerification.model.js'
import RefreshTokenModel from '../models/RefreshToken.model.js'
import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import HeadersHelper from '../helpers/Headers.helper.js'
import IpHelper from '../helpers/Ip.helper.js'
import JwtHelper from '../helpers/Jwt.helper.js'
import PasswordHelper from '../helpers/Password.helper.js'
import ResponseHelper from '../helpers/Response.helper.js'

/**
 * @typedef {object} AuthenticationController The authentication controllers (for running the methods bound to the route)
 * 1) Units - Controller for fetching information of which units/devices the user is currently logged in on
 * 2) RevokeUnit - The controller for the user to logout a unit
 * 3) VerifyEmail - Controller for the user to verify their email with (/api/auth/email/verify/:evt?email=...)
 * 4) Login - Controller that handles logging in a user
 * 5) Logout - Controller that handles logging out a user
 */
const AuthenticationController              = {}

// * 1) Controller for fetching information of which units/devices the user is currently logged in on
AuthenticationController.Units              = async (req, res, next) => {
  try {
    const userId                            = CookiesHelper.GetUserIdCookie(req)

    const units                             = await RefreshTokenModel.find({ userId: userId, isRevoked: false })

    if(!units || !Object.entries(units).length)
      throw ErrorHelper.UserRecordsNotFound()

    return ResponseHelper.UserLoggedInUnitsFound(res, units)

  } catch (error) {
    return next(error)
  }
}

AuthenticationController.RevokeUnit         = async (req, res, next) => {
  try {
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const refreshTokenIdFromParams          = req.params.refreshTokenId

    if(!refreshTokenIdFromParams)
      throw ErrorHelper.RefreshTokenIdParamNotFound()

    const refreshTokenRecord                = await RefreshTokenModel
      .findOne({ _id: refreshTokenIdFromParams, userId: userId, isRevoked: false })

    if(!refreshTokenRecord)
      throw ErrorHelper.RefreshTokenRecordNotFound()

    refreshTokenRecord.isRevoked            = true

    await refreshTokenRecord
      .save()
      .catch((error) => next(error))

    return ResponseHelper.UnitSuccessfullyRevoked(res, refreshTokenRecord.ip, refreshTokenRecord.userAgent)

  } catch (error) {
    return next(error)
  }
}

// * 3) Controller for the user to verify their email with (/api/auth/email/verify/:evt?email=abc@abc.com)
AuthenticationController.VerifyEmail        = async (req, res, next) => {
  try {
    const evt                               = req.params.evt
    const email                             = req.query.email

    if(!evt)
      throw ErrorHelper.EmailVerificationTokenNotFound()

    else if(!email)
      throw ErrorHelper.EmailQueryNotFound()

    const emailVerificationRecord           = await EmailVerificationModel.findOne({ email: email, evt: evt })

    if(!emailVerificationRecord)
      throw ErrorHelper.UserEmailVerifyRecordNotFound()

    else if(emailVerificationRecord.isVerified)
      throw ErrorHelper.UserEmailVerified()

    emailVerificationRecord.isVerified      = true

    return await emailVerificationRecord
      .save()
      .then(() => ResponseHelper.UserEmailVerifySuccessful(res))
      .catch((error) => next(error))

  } catch (error) {
    return next(error)
  }
}

// * 4) Controller that handles logging in a user
AuthenticationController.Login              = async (req, res, next) => {
  try {
    const {
      email,
      password
    }                                       = req.body

    if(!email)
      throw ErrorHelper.EmailRequired()

    else if(!password)
      throw ErrorHelper.PasswordRequired()

    const user                              = await UserModel.findOne({ email: email }).select('+password')

    if(!user)
      throw ErrorHelper.UserByEmailNotFound(email)

    if(await !PasswordHelper.Verify(user.password, password))
      throw ErrorHelper.PasswordIncorrect()

    const clientIp                          = IpHelper.GetIp(req)

    if(!clientIp)
      throw ErrorHelper.ClientIpNotFound()

    const jwtid                             = uuidv4()

    req.session.jwtid                       = jwtid

    const accessToken                       = JwtHelper.SignAccessToken(user._id, jwtid)
    const refreshToken                      = JwtHelper.SignRefreshToken(user._id)

    const newRefreshTokenRecord             = new RefreshTokenModel()

    newRefreshTokenRecord.userId            = user._id
    newRefreshTokenRecord.refreshToken      = refreshToken
    newRefreshTokenRecord.ip                = clientIp
    newRefreshTokenRecord.userAgent         = req.headers['user-agent'] || getUserAgent()

    const savedTokenRecord                  = await newRefreshTokenRecord
      .save()
      .catch((error) => next(error))

    CookiesHelper.SetUserIdCookie(user._id, res)
    CookiesHelper.SetAccessTokenCookie(accessToken, res)
    CookiesHelper.SetRefreshTokenIdCookie(newRefreshTokenRecord._id, res)

    return ResponseHelper.UserLoginSuccessful(res, user)

  } catch (error) {
    return next(error)
  }
}

// * 5) Controller that handles logging out a user
AuthenticationController.Logout             = async (req, res, next, forcedLogout = false) => {
  try {
    const clientIp                          = IpHelper.GetIp(req)
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const refreshTokenId                    = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)
    const refreshTokenRecord                = await RefreshTokenModel
      .findOne({ _id: refreshTokenId, userId: userId })

    if(refreshTokenRecord)
      await RefreshTokenModel.findOneAndUpdate({ _id: refreshTokenId, userId: userId, isRevoked: false }, { isRevoked: true })

    CookiesHelper.InvalidateCookie('userId', res)
    CookiesHelper.InvalidateCookie('accessToken', res)
    CookiesHelper.InvalidateCookie('refreshTokenId', res)

    return ResponseHelper.UserLogoutSuccessful(res, forcedLogout)

  } catch (error) {
    return next(error)
  }
}

export {
  AuthenticationController as default
}
