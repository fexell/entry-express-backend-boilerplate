import { Router } from 'express'

import AuthenticationController from '../../controllers/Authentication.controller.js'

import AuthenticationMiddleware from '../../middlewares/Authentication.middleware.js'

const AuthenticationRoute                   = Router()

AuthenticationRoute
  .get('/units', [
    AuthenticationMiddleware.AccountInactive,
    AuthenticationMiddleware.EmailVerified,
    AuthenticationMiddleware.RevokedToken,
    AuthenticationMiddleware.Authenticate,
  ], AuthenticationController.Units)

AuthenticationRoute
  .post('/login', [
    AuthenticationMiddleware.AlreadyLoggedIn,
    AuthenticationMiddleware.AccountInactive,
    AuthenticationMiddleware.EmailVerified,
  ], AuthenticationController.Login)
  .post('/logout', [
    AuthenticationMiddleware.AlreadyLoggedOut,
    AuthenticationMiddleware.RevokedToken,
    AuthenticationMiddleware.Authenticate,
  ], AuthenticationController.Logout)

AuthenticationRoute
  .put('/units/revoke/:refreshTokenId', [
    AuthenticationMiddleware.AccountInactive,
    AuthenticationMiddleware.EmailVerified,
    AuthenticationMiddleware.RevokedToken,
    AuthenticationMiddleware.Authenticate,
  ], AuthenticationController.RevokeUnit)
  .put('/email/verify/:evt', [
    AuthenticationMiddleware.AccountInactive,
  ], AuthenticationController.VerifyEmail)

export {
  AuthenticationRoute as default
}
