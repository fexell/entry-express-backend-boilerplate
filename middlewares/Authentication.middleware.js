import mongoose, { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import AuthenticationController from '../controllers/Authentication.controller.js'

import EmailVerificationModel from '../models/EmailVerification.model.js'
import RefreshTokenModel from '../models/RefreshToken.model.js'
import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import HeadersHelper from '../helpers/Headers.helper.js'
import IpHelper from '../helpers/Ip.helper.js'
import JwtHelper from '../helpers/Jwt.helper.js'
import StringHelper from '../helpers/String.helper.js'

/**
 * @typedef {object} AuthenticationMiddleware The authentication middleware object
 * 1) AlreadyLoggedIn - The middleware to check if the user is already logged in
 * 2) AlreadyLoggedOut - The middleware to check if the user is already logged out
 * 3) RevokedToken - The middleware to check if the refresh token has been revoked
 * 4) EmailVerified - The middleware that checks if the user has verified their email
 * 5) AccountInactive - The middleware that checks if the user's account is inactive
 * 6) Authenticate - The middleware that makes sure the user has access to the requested route
 */
const AuthenticationMiddleware              = {}

// * 1) AlreadyLoggedIn - Check's if the user is already logged in
AuthenticationMiddleware.AlreadyLoggedIn    = async (req, res, next) => {
  try {

    // Get client's ip and cookies
    const clientIp                          = IpHelper.GetIp(req)
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const accessToken                       = CookiesHelper.GetAccessTokenCookie(req)
    const refreshTokenId                    = CookiesHelper.GetRefreshTokenIdCookie(req)

    // If user id, client ip, and refresh token id is set, return the refresh token record
    const refreshTokenRecord                = userId && clientIp && refreshTokenId
      ? await RefreshTokenModel
        .findOne({ _id: refreshTokenId, userId: userId, ip: clientIp, userAgent: HeadersHelper.GetUserAgent(req), isRevoked: false })
      : null

    // If user id, access token, refresh token id, OR refresh token record was found, tell the user they're already logged in
    if((userId && accessToken && refreshTokenId && refreshTokenRecord) || (userId && refreshTokenId))
      throw ErrorHelper.UserAlreadyLoggedIn()

    return next()
  } catch (error) {
    return next(error)
  }
}

// * 2) AlreadyLoggedOut - Check's if the user is already logged out
AuthenticationMiddleware.AlreadyLoggedOut   = async (req, res, next) => {
  try {
    const clientIp                          = IpHelper.GetIp(req)
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const accessToken                       = CookiesHelper.GetAccessTokenCookie(req)
    const refreshTokenId                    = CookiesHelper.GetRefreshTokenIdCookie(req)
    const refreshTokenRecord                = userId && clientIp && refreshTokenId
      ? await RefreshTokenModel
        .findOne({ _id: refreshTokenId, userId: userId, ip: clientIp, userAgent: HeadersHelper.GetUserAgent(req), isRevoked: false })
      : null

    if((!userId && !accessToken && !refreshTokenId && !refreshTokenRecord))
      throw ErrorHelper.UserAlreadyLoggedOut()

    return next()
  } catch (error) {
    return next(error)
  }
}

// * 3) RevokedToken - Check's if the refresh token is revoked, and logs the user out if it is
AuthenticationMiddleware.RevokedToken       = async (req, res, next) => {
  try {

    // Get client ip, user id cookie, and refresh token id cookie
    const clientIp                          = IpHelper.GetIp(req)
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const refreshTokenId                    = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

    // If a client ip couldn't be found
    if(!clientIp)
      throw ErrorHelper.ClientIpNotFound()

    // If user id, client ip, and refresh token id is present attempt to find a revoked refresh token record
    const refreshTokenRecord                = userId && clientIp && refreshTokenId 
      ? await RefreshTokenModel
        .findOne({ _id: refreshTokenId, userId: userId, ip: clientIp, userAgent: HeadersHelper.GetUserAgent(req), isRevoked: true })
        .select('+isRevoked')
      : null

    // If a refresh token record was found (with isRevoked set to true), logout the user
    if(refreshTokenRecord && refreshTokenRecord.isRevoked)
      return AuthenticationController.Logout(req, res, next, 'UserLoggedOutRevokedToken')

    // "However, the cookie itself isn't available in req.cookies or similar until the next request..."
    // ...so make these available in the the same request
    req.refreshTokenId                      = refreshTokenId

    return next()
  } catch (error) {
    return next(error)
  }
}

// * 4) EmailVerified - The middleware that checks if the user has verified their email
AuthenticationMiddleware.EmailVerified      = async (req, res, next) => {
  try {

    // Get the user's id from the cookie
    const userId                            = CookiesHelper.GetUserIdCookie(req)

    // If req.body is set, get the email from it, otherwise, attempt to get it from req.query
    const email                             = req.body ? req.body.email : req.query.email

    // Find a email verification record either by user id or email, AND where isVerified === false
    const emailVerificationRecord           = await EmailVerificationModel
      .findOne({ $or: [ { _id: userId }, { email: email } ] })
      .and([ { isVerified: false } ])

    // If a record was found, let the user know that they're unverified
    if(emailVerificationRecord)
      throw ErrorHelper.UserEmailUnverified()

    // If the user's email is verified, continue to the next middleware/route
    return next()

  } catch (error) {
    return next(error)
  }
}

// * 5) AccountInactive - The middleware that checks if the user's account is inactive
AuthenticationMiddleware.AccountInactive    = async (req, res, next) => {
  try {

    // Get the user id from the cookie
    const userId                            = CookiesHelper.GetUserIdCookie(req)

    // If req.body is set get the email from it, otherwise, attempt to get it from the query (...?email=abc@abc.com)
    const email                             = req.body ? req.body.email : req.query.email

    // Attempt to get the user from their user id (in the cookie)
    const userById                          = await UserModel.findOne({ _id: userId, isActive: false })

    // Attempt to get the user from an email
    const userByEmail                       = await UserModel.findOne({ email: email, isActive: false })

    // If user was found by user id--and NOT by email--log the user out
    if(userById && !userByEmail)
      return AuthenticationController.Logout(req, res, next, 'UserLoggedOutAccountInactive')

    // Else if user found by email--and NOT by user id--tell the user that their account is inactive
    else if(!userById && userByEmail)
      return AuthenticationController.Logout(req, res, next, 'UserLoggedOutAccountInactive')

    // If the user is NOT inactive, continue to the next middleware/route
    return next()

  } catch (error) {
    return next(error)
  }
}

// * 6) Authenticate - Check's if the user is authenticated to access the route
AuthenticationMiddleware.Authenticate       = async (req, res, next) => {
  try {

    // Get the cookies
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const accessToken                       = CookiesHelper.GetAccessTokenCookie(req)

    // If the user is not logged in, say that the route is protected
    if(!userId && !accessToken)
      throw ErrorHelper.RouteProtected()

    // If access token is valid
    if(accessToken) {

      // Verify/decode the access token
      const decodedAccessToken              = JwtHelper.VerifyAccessToken(accessToken)

      // If the token is not valid and couldn't be verified, log the user out
      if(!decodedAccessToken)
        return AuthenticationController.Logout(req, res, next, 'AccessTokenInvalid') // Access token has been tampered with => log the user out

      // If the user id cookie is not, set it to be the decoded access token user id
      else if(!userId)
        CookiesHelper.SetUserIdCookie(decodedAccessToken.userId, res)

      // Check if the user id cookie has been tampered with
      else if(decodedAccessToken.id !== userId || !mongoose.isValidObjectId(decodedAccessToken.id) || !mongoose.isValidObjectId(userId))
        return AuthenticationController.Logout(req, res, next, 'UserIdMismatch') // User id cookie has been tampered with => log the user out

      req.accessToken                       = accessToken
        
      return next()
    } else {

      // Check if the user id cookie is present. If not => return an error message
      if(!userId)
        throw ErrorHelper.UserIdCookieNotFound()

      // Get the client's/user's ip
      const clientIp                        = IpHelper.GetIp(req)

      // Check if a client ip could be found
      if(!clientIp)
        throw ErrorHelper.ClientIpNotFound()

      // Get the refresh token id cookie
      const refreshTokenId                  = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

      // If the refresh token id cookie is either not found, or not valid
      if(!refreshTokenId)
        throw ErrorHelper.RefreshTokenIdNotFound()

      // Get the refresh token record from the mongodb database
      const refreshTokenRecord              = await RefreshTokenModel
        .findOne({ _id: refreshTokenId, userId: userId, ip: clientIp, userAgent: HeadersHelper.GetUserAgent(req), isRevoked: false })
        .select('+refreshToken +isRevoked')

      // If the refresh token record couldn't be found, or the refresh token couldn't be verified, logout the user
      if((!refreshTokenRecord) || (!JwtHelper.VerifyRefreshToken(refreshTokenRecord.refreshToken)))
        return AuthenticationController.Logout(req, res, next, true)

      refreshTokenRecord.isRevoked          = true

      await refreshTokenRecord
        .save()
        .catch((error) => next(error))

      // If the refresh token user id is not equal to the user id stored in the cookie
      if(!refreshTokenRecord.userId.equals(userId))
        return AuthenticationController.Logout(req, res, next, 'UserIdMismatch')

      const jwtid                           = uuidv4()

      req.session.jwtid                     = jwtid

      // Sign a new access token
      const newAccessToken                  = JwtHelper.SignAccessToken(userId, jwtid)
      const newRefreshToken                 = JwtHelper.SignRefreshToken(userId)

      const newRefreshTokenRecord           = new RefreshTokenModel()

      newRefreshTokenRecord.userId          = userId
      newRefreshTokenRecord.refreshToken    = newRefreshToken
      newRefreshTokenRecord.ip              = IpHelper.GetIp(req)
      newRefreshTokenRecord.userAgent       = HeadersHelper.GetUserAgent(req)

      await newRefreshTokenRecord
        .save()
        .catch((error) => next(error))

      // Set/update the cookies
      CookiesHelper.SetUserIdCookie(userId, res)
      CookiesHelper.SetAccessTokenCookie(newAccessToken, res)
      CookiesHelper.SetRefreshTokenIdCookie(newRefreshTokenRecord._id, res)

      // "However, the cookie itself isn't available in req.cookies or similar until the next request..."
      // ...so make these available in the the same request
      req.accessToken                       = newAccessToken
      req.refreshTokenId                    = newRefreshTokenRecord._id

      // Continue to next middleware/route
      return next()
    }
  } catch (error) {

    // If there is an error, let the error middleware handle it (./Error.middleware.js)
    return next(error)
  }
}

export {
  AuthenticationMiddleware as default
}
