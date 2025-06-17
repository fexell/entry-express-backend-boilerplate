import jwt from 'jsonwebtoken'

import app from '../api.js'

const JwtHelper                             = {}

JwtHelper.Options                           = (expiresIn, jwtid) => {
  return {
    issuer                                  : 'eeb',
    algorithm                               : 'RS256',
    ...(expiresIn && { expiresIn: expiresIn }),
    ...(jwtid && { jwtid: jwtid }),
  }
}

JwtHelper.Sign                              = (value, expiresIn, jwtid, secret) => {
  return jwt.sign(value, {
    key: app.get('PRIVATE_KEY'),
    passphrase: secret ? secret : app.get('JWT_SECRET')
  }, JwtHelper.Options(expiresIn, jwtid))
}
JwtHelper.SignAccessToken                   = (id, jwtid) => JwtHelper.Sign({ id: id }, '3m', jwtid)
JwtHelper.SignRefreshToken                  = (id) => JwtHelper.Sign({ id: id }, '30d')

JwtHelper.Verify                            = (token, expiresIn, jwtid) => jwt.verify(token, app.get('PUBLIC_KEY'), JwtHelper.Options(expiresIn, jwtid))
JwtHelper.VerifyAccessToken                 = (token, jwtid) => JwtHelper.Verify(token, '3m', jwtid)
JwtHelper.VerifyRefreshToken                = (token) => JwtHelper.Verify(token, '30d')

export {
  JwtHelper as default
}
