import { rateLimit } from 'express-rate-limit'
import { t } from 'i18next'

import RateLimitModel from '../models/RateLimit.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import IpHelper from '../helpers/Ip.helper.js'

const Limiter                               = rateLimit({
  windowMs                                  : 10 * 60 * 1000, // 10 minutes
  limit                                     : 80,
  standardHeaders                           : 'draft-8',
  legacyHeaders                             : false,
  message                                   : { error: { message: t('TooManyRequests') } },
  handler                                   : async (req, res, next, options) => {
    const userId                            = CookiesHelper.GetUserIdCookie(req) || null
    const clientIp                          = IpHelper.GetIp(req)
    const newRateLimitModel                 = new RateLimitModel()

    if(userId)
      newRateLimitModel.userId              = userId

    if(clientIp)
      newRateLimitModel.ip                  = clientIp

    await newRateLimitModel
      .save()
      .catch((error) => next(error))

    return res
      .status(options.statusCode)
      .json({ error: { message: t('TooManyRequests') } })
  }
})

export {
  Limiter as default
}
