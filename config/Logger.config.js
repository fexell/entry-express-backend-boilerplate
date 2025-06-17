import winston, { format } from 'winston'

import 'dotenv/config'
import 'winston-mongodb'

const DB_STRING                             = process.env.NODE_ENV !== 'production'
  ? process.env.DB_STRING || 'mongodb://localhost:27017/eeb'
  : process.env.DB_STRING || 'mongodb://production-db:27017/eeb'

const Logger                                = winston.createLogger({
  level                                     : 'info',
  format                                    : winston.format.json(),
  transports                                : [
    new winston.transports.MongoDB({
      db                                    : DB_STRING,
      collection                            : 'logs',
      level                                 : 'info',
      tryReconnect                          : true,
    }),
  ],
})

export {
  Logger as default
}
