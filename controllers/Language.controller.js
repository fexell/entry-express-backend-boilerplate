

import CookiesHelper from '../helpers/Cookies.helper.js'
import ResponseHelper from '../helpers/Response.helper.js'

const LanguageController                    = {}

LanguageController.SetLanguage              = (req, res, next) => {
  const { lng }                             = req.query

  CookiesHelper.SetLanguageCookie(lng)

  return ResponseHelper.LanguageSet(res)
}

export {
  LanguageController as default
}
