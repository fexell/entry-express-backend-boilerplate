import 'dotenv/config'

export const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  SESSION_SECRET,
  CSRF_SECRET,
  DB_STRING,
}                                           = process.env

export const getDbString                    = () => {
  if(NODE_ENV !== 'production')
    return process.env.DB_STRING || 'mongodb://localhost:27017/eeb'

  return process.env.DB_STRING || 'mongodb://production-db:27017/eeb'
}
