import express from 'express'
import fs from 'fs'
import { t } from 'i18next'
import morgan from 'morgan'

import CorsMiddleware from './config/Cors.config.js'
import HelmetMiddleware from './config/Helmet.config.js'
import i18nMiddleware from './config/i18n.config.js'
import Logger from './config/Logger.config.js'
import ConnectDatabase from './config/Mongoose.config.js'
import Limiter from './config/RateLimit.config.js'
import ServerConfig from './config/Server.config.js'
import SessionMiddleware from './config/Session.config.js'
import SecurityMiddlewares, { CookieParserMiddleware, CsrfProtection } from './config/Security.config.js'
import SlowDownLimiter from './config/SlowDown.config.js'

import './config/Environment.config.js'
import './config/i18n.config.js'

import ErrorMiddleware from './middlewares/Error.middleware.js'
import LanguageMiddleware from './middlewares/Language.middleware.js'

import CookiesHelper from './helpers/Cookies.helper.js'
import IpHelper from './helpers/Ip.helper.js'

const app                                   = express()

const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  COOKIE_SECRET,
  SESSION_SECRET,
}                                           = process.env

const PRIVATE_KEY                           = fs.readFileSync('jwt.key', 'utf-8')
const PUBLIC_KEY                            = fs.readFileSync('jwt.key.pub', 'utf-8')

const getLogLevel                           = (statusCode) => {
  if(statusCode >= 400)
    return 'error'

  else if(statusCode >= 300)
    return 'warn'

  else if(statusCode >= 200)
    return 'info'

  return 'info'
}

ConnectDatabase()

morgan.token('userIdOrIp', (req) => CookiesHelper.GetUserIdCookie(req) || IpHelper.GetIp(req))
morgan.token('statusCode', (req, res) => res.statusCode)

app.set('trust proxy', ServerConfig.trustProxy)
app.disable('x-powered-by')

app.set('NODE_ENV', NODE_ENV)
app.set('JWT_SECRET', JWT_SECRET)
app.set('COOKIE_SECRET', COOKIE_SECRET)
app.set('PRIVATE_KEY', PRIVATE_KEY)
app.set('PUBLIC_KEY', PUBLIC_KEY)

app.use(CorsMiddleware)
app.use(HelmetMiddleware)
app.use(morgan(':userIdOrIp => :method :statusCode :url :user-agent :response-time', {
  stream                                    : {
    write                                   : (message) => {
      const parts                           = message.trim().split(' ')
      const statusCode                      = parseInt(parts[ 3 ], 10)
      const level                           = getLogLevel(statusCode)

      Logger.log(level, message.trim())
    }
  }
}))
app.use(SessionMiddleware(NODE_ENV, SESSION_SECRET))
app.use(CookieParserMiddleware(COOKIE_SECRET, NODE_ENV))
app.use(i18nMiddleware)
app.use(LanguageMiddleware.SetLanguage)
app.use(SecurityMiddlewares())
app.use(Limiter)
app.use(SlowDownLimiter)

import IndexRoute from './routes/index.route.js'

app.use('/api', [ CsrfProtection.csrfSynchronisedProtection ], IndexRoute)
app.use((req, res) => res.status(404).send(t('RouteNotFound')))

app.use(ErrorMiddleware.ErrorHandler)

app.listen(ServerConfig.port, () => {
  console.log(`API is now listening on port ${ ServerConfig.port }`)
})

export {
  app as default
}
