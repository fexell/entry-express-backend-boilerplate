import { slowDown } from 'express-slow-down'

const SlowDownLimiter                       = slowDown({
  windowMs                                  : 10 * 60 * 1000,
  delayAfter                                : 5,
  delayMs                                   : (hits) => hits * 100,
})

export {
  SlowDownLimiter as default
}
