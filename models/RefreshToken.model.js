import mongoose, { Schema } from 'mongoose'

const RefreshTokenSchema                    = new Schema({
  userId                                    : {
    type                                    : Schema.Types.ObjectId,
  },
  refreshToken                              : {
    type                                    : String,
    required                                : true,
    select                                  : false,
  },
  ip                                        : {
    type                                    : String,
  },
  userAgent                                 : {
    type                                    : String,
    required                                : true,
  },
  isRevoked                                 : {
    type                                    : Boolean,
    required                                : true,
    default                                 : false,
    select                                  : false,
  },
}, {
  timestamps                                : true,
})

const RefreshTokenModel                     = mongoose.model('RefreshToken', RefreshTokenSchema)

export {
  RefreshTokenModel as default
}
