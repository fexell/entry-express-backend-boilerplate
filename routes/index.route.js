import express, { Router } from 'express'
import multer from 'multer'

import CsrfRoute from './Csrf/Csrf.route.js'
import AuthenticationRoute from './Authentication/Authentication.route.js'
import LanguageRoute from './Language/Language.route.js'
import UserRoute from './User/User.route.js'

const IndexRoute                            = Router()

IndexRoute.use('/csrf', CsrfRoute)
IndexRoute.use('/auth', multer().array(), AuthenticationRoute)
IndexRoute.use('/user', multer().array(), UserRoute)
IndexRoute.use('/lang', LanguageRoute)

export {
  IndexRoute as default
}
