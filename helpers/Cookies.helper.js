import mongoose from 'mongoose'

import ErrorHelper from './Error.helper.js'

import app from '../api.js'
import path from 'path'

// The "regular" cookie default options
const CookieOptions                         = (maxAge) => {
  return {
    maxAge                                  : maxAge,
    secure                                  : app.get('NODE_ENV') === 'production',
    sameSite                                : 'strict',
    path                                    : '/',
  }
}

// The signed cookie default options
const SignedCookieOptions                   = (maxAge) => {
  return {
    httpOnly                                : true,
    maxAge                                  : maxAge,
    signed                                  : true,
    sameSite                                : 'strict',
    secure                                  : app.get('NODE_ENV') !== 'production' ? false : true,
  }
}

// The CookiesHelper object
const CookiesHelper                         = {}

// A normal method for setting regular cookies
CookiesHelper.SetCookie                     = (name, value, maxAge, res) => {
  return res.cookie(name, value, CookieOptions(maxAge))
}

// Method for setting a signed http-only cookie
CookiesHelper.SetSignedHttpOnlyCookie       = (name, value, maxAge, res) => {
  return res.cookie(name, value, SignedCookieOptions(maxAge))
}

// Quick access method for setting the user id cookie
CookiesHelper.SetUserIdCookie               = (value, res) => {
  return CookiesHelper.SetCookie('userId', value, 2592000000, res) // 2592000000 = 30 days
}

// Quick access method for getting user id cookie
CookiesHelper.GetUserIdCookie               = (req) => req.cookies.userId && mongoose.isValidObjectId(req.cookies.userId)
  ? req.cookies.userId
  : null

// Quick access method for setting the access token cookie
CookiesHelper.SetAccessTokenCookie          = (value, res) => {
  return CookiesHelper.SetSignedHttpOnlyCookie('accessToken', value, 180000, res) // 180000 = 3 min
}

// Quick access method for getting the access token cookie
CookiesHelper.GetAccessTokenCookie          = (req) => req.signedCookies.accessToken

// Quick access method for setting the refresh token id cookie
CookiesHelper.SetRefreshTokenIdCookie       = (value, res) => {
  return CookiesHelper.SetSignedHttpOnlyCookie('refreshTokenId', value, 2592000000, res) // 2592000000 = 30 days
}

// Quick access method for getting refresh token id cookie
CookiesHelper.GetRefreshTokenIdCookie       = (req) => req.signedCookies.refreshTokenId && mongoose.isValidObjectId(req.signedCookies.refreshTokenId)
 ? req.signedCookies.refreshTokenId
 : null

// Quick access method for setting the language cookie
CookiesHelper.SetLanguageCookie             = (lang) => CookiesHelper.SetCookie('i18next', lang)

// The method for invalidating/expiring a cookie
CookiesHelper.InvalidateCookie              = (name, res) => {
  return res.cookie(name, null, { maxAge: 0, expires: new Date(0) })
}

export {
  CookiesHelper as default
}
