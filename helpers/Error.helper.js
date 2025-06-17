import { t } from 'i18next'

/**
 * @typedef {object} ErrorHelper Error helper object
 */
const ErrorHelper                           = {}

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode                         = statusCode
  }
}

/**
 * * HTTP Status Codes
 * 400 === Bad Request
 * 401 === Unauthorized
 * 402 === Payment Required
 * 403 === Forbidden
 * 404 === Not Found
 * 405 === Method Not Allowed
 * 406 === Not Acceptable
 * 407 === Proxy Authentication Required
 * 408 === Request Timeout
 * 409 === Conflict
 * 410 === Gone
 * 411 === Length Required
 * 412 === Precondition Failed
 * 413 === Payload Too Large
 * 414 === URI Too Long
 * 415 === Unsupported Media Type
 * 416 === Range Not Satisfiable
 * 417 === Expectation Failed
 * 418 === I'm a teapot
 * 421 === Misdirected Request
 * 422 === Unprocessable Content
 * 423 === Locked
 * 424 === Failed Dependency
 * 425 === Too Early
 * 426 === Upgrade Required
 * 428 === Precondition Required
 * 429 === Too Many Requests
 * 431 === Request Header Fields Too Large
 * 451 === Unavailable For Legal Reasons
 */

ErrorHelper.FormBodyNotFound                = () => new CustomError(t('FormBodyNotFound'), 500)

ErrorHelper.AccountInactive                 = () => new CustomError(t('AccountInactive'), 403)

ErrorHelper.EmailRequired                   = () => new CustomError(t('EmailRequired'), 403)
ErrorHelper.EmailCreateTokenFailed          = () => new CustomError(t('EmailCreateTokenFailed'), 500)
ErrorHelper.EmailVerificationTokenNotFound  = () => new CustomError(t('EmailVerificationTokenNotFound'), 404)
ErrorHelper.EmailQueryNotFound              = () => new CustomError(t('EmailQueryNotFound'), 404)

ErrorHelper.PasswordRequired                = () => new CustomError(t('PasswordRequired'), 403)
ErrorHelper.PasswordConfirmIncorrect        = () => new CustomError(t('PasswordConfirmIncorrect'), 400)
ErrorHelper.PasswordIncorrect               = () => new CustomError(t('PasswordIncorrect'), 403)

ErrorHelper.UserByEmailNotFound             = (email) => new CustomError(t('UserByEmailNotFound', { email: email }), 404)
ErrorHelper.UserNotFound                    = () => new CustomError(t('UserNotFound'), 404)
ErrorHelper.UserIdInvalid                   = () => new CustomError(t('UserIdInvalid'), 401)
ErrorHelper.UserIdNotFound                  = () => new CustomError(t('UserIdNotFound'), 404)
ErrorHelper.UserIdCookieNotFound            = () => new CustomError(t('UserIdCookieNotFound'), 404)
ErrorHelper.UserAlreadyLoggedIn             = () => new CustomError(t('UserAlreadyLoggedIn'), 409)
ErrorHelper.UserAlreadyLoggedOut            = () => new CustomError(t('UserAlreadyLoggedOut'), 409)
ErrorHelper.UserCurrentlyLoggedOut          = () => new CustomError(t('UserCurrentlyLoggedOut'), 403)
ErrorHelper.UserIdNorAccessTokenFound       = () => new CustomError(t('UserIdNorAccessTokenFound'), 404)
ErrorHelper.UserIdMismatch                  = () => new CustomError(t('UserIdMismatch'), 409)
ErrorHelper.UserRecordsNotFound             = () => new CustomError(t('UserRecordsNotFound'), 404)
ErrorHelper.UserEmailVerified               = () => new CustomError(t('UserEmailVerified'), 409)
ErrorHelper.UserEmailUnverified             = () => new CustomError(t('UserEmailUnverified'), 401)
ErrorHelper.UserEmailVerifyRecordNotFound   = () => new CustomError(t('UserEmailVerifyRecordNotFound'), 404)
ErrorHelper.UserEmailVerifyFailed           = () => new CustomError(t('UserEmailVerifyFailed'), 500)
ErrorHelper.UserLoggedOutRevokedToken       = () => new CustomError(t('UserLoggedOutRevokedToken'), 401)

ErrorHelper.ClientIpNotFound                = () => new CustomError(t('ClientIpNotFound'), 404)

ErrorHelper.AccessTokenInvalid              = () => new CustomError(t('AccessTokenInvalid'), 403)
ErrorHelper.AccessTokenCookieNotFound       = () => new CustomError(t('AccessTokenCookieNotFound'), 404)

ErrorHelper.RefreshTokenRecordNotFound      = () => new CustomError(t('RefreshTokenRecordNotFound'), 404)
ErrorHelper.RefreshTokenIdNotFound          = () => new CustomError(t('RefreshTokenIdNotFound'), 404)
ErrorHelper.RefreshTokenIdInvalid           = () => new CustomError(t('RefreshTokenIdInvalid'), 403)
ErrorHelper.RefreshTokenRevoked             = () => new CustomError(t('RefreshTokenRevoked'), 403)
ErrorHelper.RefreshTokenIpQueryNotFound     = () => new CustomError(t('RefreshTokenIpQueryNotFound'), 403)
ErrorHelper.RefreshTokenIdParamNotFound     = () => new CustomError(t('RefreshTokenIdParamNotFound'), 404)
ErrorHelper.RefreshTokenIpParamNotFound     = () => new CustomError(t('RefreshTokenIpParamNotFound'), 404)
ErrorHelper.RefreshTokenUserAgentNotFound   = () => new CustomError(t('RefreshTokenUserAgentNotFound'), 404)

ErrorHelper.RouteProtected                  = () => new CustomError(t('RouteProtected'), 401)

export {
  ErrorHelper as default
}
