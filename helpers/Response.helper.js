import { t } from 'i18next'

import UserModel from '../models/User.model.js'

const ResponseHelper                        = {}

ResponseHelper.Success                      = (res, message, data, statusCode = 200) => {
  return res
    .status(statusCode)
    .json({
      message                               : message,
      ...(data && {
        data                                : data
      }),
    })
}

ResponseHelper.UserCreated                  = (res, userData) => ResponseHelper.Success(res, t('UserCreated', { email: userData.email }), { user: UserModel.SerializeUser(userData) }, 201)

ResponseHelper.UserLoginSuccessful          = (res, userData) => ResponseHelper.Success(res, t('UserLoginSuccessful'), { user: UserModel.SerializeUser(userData) })
ResponseHelper.UserLogoutSuccessful         = (res, forcedLogout) => ResponseHelper.Success(res, forcedLogout
  ? typeof forcedLogout !== 'string'
    ? t('UserForcedLogout')
    : t(forcedLogout)
  : t('UserLoggedOut'))
ResponseHelper.UserLoggedOutAccountInactive = (res) => ResponseHelper.Success(res, t('UserLoggedOutAccountInactive'))
ResponseHelper.UserFound                    = (res) => ResponseHelper.Success(res, t('UserFound'))
ResponseHelper.UserDocumentsFound           = (res, users) => ResponseHelper.Success(res, t('UserDocumentsFound'), { user: users })
ResponseHelper.UserLoggedInUnitsFound       = (res, documents) => ResponseHelper.Success(res, t('UserLoggedInUnitsFound'), { units: documents })
ResponseHelper.UserEmailVerifySuccessful    = (res) => ResponseHelper.Success(res, t('UserEmailVerifySuccessful'))

ResponseHelper.LanguageSet                  = (res) => ResponseHelper.Success(res, t('LanguageSet'))

ResponseHelper.UnitSuccessfullyRevoked      = (res, ip, userAgent) => ResponseHelper.Success(res, t('UnitSuccessfullyRevoked', { ip: ip, userAgent: userAgent }))

export {
  ResponseHelper as default
}
