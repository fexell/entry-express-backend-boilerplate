import express, { Router } from 'express'

import { CsrfProtection } from '../../config/Security.config.js'

const CsrfRoute                             = Router()

CsrfRoute
  .get('/', (req, res, next) => {
    try {
      const csrfToken                         = CsrfProtection.generateToken(req)

      return res.status(200).json({ csrfToken })
    } catch (error) {
      return next(error)
    }
})

export {
  CsrfRoute as default
}
