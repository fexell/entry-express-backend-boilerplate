

const LanguageMiddleware                    = {}

LanguageMiddleware.SetLanguage              = (req, res, next) => {
  try {
    res.locals.lng                            = req.language

    next()
  } catch (error) {
    return next(error)
  }
}

export {
  LanguageMiddleware as default
}
