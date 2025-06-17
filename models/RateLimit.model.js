import mongoose, { Schema } from 'mongoose'

const RateLimitSchema                       = new Schema({
  userId                                    : {
    type                                    : mongoose.Types.ObjectId,
  },
  ip                                        : {
    type                                    : String,
  }
})

const RateLimitModel                        = mongoose.model('RateLimit', RateLimitSchema)

export {
  RateLimitModel as default,
}
