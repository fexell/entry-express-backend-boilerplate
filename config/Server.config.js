import { NODE_ENV, PORT } from './Environment.config.js'

const ServerConfig                          = {
  port                                      : PORT || 5000,
  trustProxy                                : 1,
  disableXPoweredBy                         : true,
  env                                       : NODE_ENV,
}

export {
  ServerConfig as default,
}