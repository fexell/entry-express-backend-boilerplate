import { Router } from 'express'

import LanguageController from '../../controllers/Language.controller.js'

const LanguageRoute                         = Router()

LanguageRoute
  .post('/', LanguageController.SetLanguage)

LanguageRoute
  .put('/', LanguageController.SetLanguage)

export {
  LanguageRoute as default
}
