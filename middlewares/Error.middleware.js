import mongoose from 'mongoose'

import Logger from '../config/Logger.config.js'

import 'dotenv/config'

/**
 * @typedef {object} ErrorMiddleware The error middleware
 * @property {function} ErrorHandler The middleware that handles "humanizing" errors (used in api.js)
 */
const ErrorMiddleware                       = {}

ErrorMiddleware.ErrorHandler                = (error, req, res, next) => {

  // If the error is a mongoose validation error
  if(error instanceof mongoose.Error.ValidationError)
    return res
      .status(400)
      .json({
        error                               : {
          message                           : Object.values(error.errors)[ 0 ].message, // Print/handle one error at a time
        }
      })

  if(process.env.NODE_ENV === 'development')
    console.error(error)

  return res
    .status(error.statusCode ? error.statusCode : 400)
    .json({
      error                                 : {
        message                             : error.message,
      }
    })
}

export {
  ErrorMiddleware as default
}
