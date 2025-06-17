import session from 'express-session'
import MongoStore from 'connect-mongo'

import { getDbString, SESSION_SECRET } from './Environment.config.js'

const SessionMiddleware                     = (NODE_ENV, SESSION_SECRET) => session({
  secret                                    : SESSION_SECRET,
  resave                                    : true,
  saveUninitialized                         : true,
  store                                     : MongoStore.create({ mongoUrl: getDbString() }),
  cookie                                    : {
    secure                                  : NODE_ENV !== 'development'
  },
})

export {
  SessionMiddleware as default,
}
