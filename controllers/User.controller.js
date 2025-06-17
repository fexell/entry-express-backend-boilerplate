

import EmailVerificationModel from '../models/EmailVerification.model.js'
import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import JwtHelper from '../helpers/Jwt.helper.js'
import ResponseHelper from '../helpers/Response.helper.js'

/**
 * 1) User - Retrieves the logged in user's information/data
 * 2) SignUp - The route that handles creating the new user
 */
const UserController                        = {}

// 1) User - Retrieves the logged in user's information/data
UserController.User                         = async (req, res, next) => {
  try {

    // Get the user id
    const userId                            = CookiesHelper.GetUserIdCookie(req)

    // Find the user document by the mongodb object id
    const userRecord                        = await UserModel.findById(userId)

    // If a document WASN'T found, let the user know
    if(!userRecord)
      throw ErrorHelper.UserNotFound()

    // Respond with the found document
    return ResponseHelper.Success(res, 'User information found.', { user: userRecord })
  } catch (error) {
    return next(error)
  }
}

// 2) SignUp - Registers the new user, based from the entered form body data
// !Most of the logic (verification, validation, etc.) is handled in the user model file (../models/User.model.js)
UserController.SignUp                       = async (req, res, next) => {
  try {

    if(!req.body)
      throw ErrorHelper.FormBodyNotFound()

    // Get all the form body data
    const {
      email,
      username,
      forename,
      surname,
      password,
      confirmPassword,
    }                                       = req.body

    // Initiate a new user
    const newUserRecord                     = new UserModel()

    // Set the corresponding data to its field
    newUserRecord.email                     = email
    newUserRecord.username                  = username
    newUserRecord.forename                  = forename
    newUserRecord.surname                   = surname
    newUserRecord.password                  = password
    newUserRecord.confirmPassword           = confirmPassword

    // If the password and confirmation of the password is mismatching
    if(password !== confirmPassword)
      throw ErrorHelper.PasswordConfirmIncorrect()

    // Attempt to save the user to the database
    return await newUserRecord
      .save()
      .then(async (doc) => {
        const newEmailVerificationRecord    = new EmailVerificationModel()

        newEmailVerificationRecord.userId   = doc._id
        newEmailVerificationRecord.email    = doc.email

        await newEmailVerificationRecord
          .save()
          .catch((error) => next(error))

        return ResponseHelper.UserCreated(res, doc)
      })
      .catch((error) => next(error))

  } catch (error) {
    return next(error)
  }
}

export {
  UserController as default
}
