import { Router } from 'express'

import UserController from '../../controllers/User.controller.js'

import AuthenticationMiddleware from '../../middlewares/Authentication.middleware.js'

const UserRoute                             = Router()

UserRoute
  .get('/', [
    AuthenticationMiddleware.AccountInactive,
    AuthenticationMiddleware.EmailVerified,
    AuthenticationMiddleware.RevokedToken,
    AuthenticationMiddleware.Authenticate,
  ], UserController.User)

UserRoute
  .post('/', UserController.SignUp)

export {
  UserRoute as default
}
