import cookieParser from 'cookie-parser'
import { xss } from 'express-xss-sanitizer'
import { csrfSync } from 'csrf-sync'

const CookieParserMiddleware                = (COOKIE_SECRET, NODE_ENV) => cookieParser(COOKIE_SECRET, { secure: NODE_ENV !== 'development' })

const SecurityMiddlewares                   = () => [
  xss(),
]

const CsrfProtection                        = csrfSync()

export {
  CookieParserMiddleware,
  SecurityMiddlewares as default,
  CsrfProtection,
}
