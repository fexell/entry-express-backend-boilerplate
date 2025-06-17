import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'

import JwtHelper from '../helpers/Jwt.helper.js'

const EmailVerificationSchema               = new Schema({
  userId                                    : {
    type                                    : mongoose.Types.ObjectId,
  },
  email                                     : {
    type                                    : String,
    lowercase                               : true,
    trim                                    : true,
    required                                : true,
  },
  evt                                       : {
    type                                    : String,
    default                                 : crypto.randomBytes(16).toString('hex'),
    expires                                 : '10m',
  },
  isVerified                                : {
    type                                    : Boolean,
    required                                : true,
    default                                 : false,
  }
}, {
  timestamps                                : true,
})

const EmailVerificationModel                = mongoose.model('EmailVerification', EmailVerificationSchema)

export {
  EmailVerificationModel as default
}
