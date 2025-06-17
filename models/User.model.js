import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'
import { t } from 'i18next'

import PasswordHelper from '../helpers/Password.helper.js'
import StringHelper from '../helpers/String.helper.js'

/**
 * @typedef {Object} UserSchema
 * @property {string} UserSchema.email - The user's email
 * @property {string} UserSchema.username - The user's username
 * @property {string} UserSchema.forename - The user's forename (first name)
 * @property {string} UserSchema.surname - The user's surname
 * @property {string} UserSchema.password - The user's hashed password
 * @property {enum} UserSchema.role - The user's role, DEFAULT: 'user'
 */
const UserSchema                            = new Schema({
  email                                     : {
    type                                    : String,
    lowercase                               : true,
    trim                                    : true,
    unique                                  : true,
    required                                : [
      true,
      t('EmailRequired'),
    ],
    match                                   : [
      /^[a-zA-ZÅÄÖåäö0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      t('EmailInvalid'),
    ],
  },
  username                                  : {
    type                                    : String,
    trim                                    : true,
    unique                                  : true,
    minlength                               : 5,
    maxlength                               : 30,
    required                                : [
      true,
      t('UsernameRequired'),
    ],
    match                                   : [
      /^[a-zA-Z0-9]+$/,
      t('UsernameInvalid'),
    ],
    validate                                : {
      validator                             : async function(value) {
        const user                          = await this.constructor.findOne({ username: { $regex: value, $options: 'i' } })

        if((this.isNew && user))
          throw new Error(t('UsernameTaken'))

        else if((!this.isNew && !new RegExp(value).test(user.username)))
          throw new Error(t('UsernameVariation'))

        return true
      },
    },
  },
  forename                                  : {
    type                                    : String,
    trim                                    : true,
    minlength                               : 2,
    required                                : [
      true,
      t('ForenameRequired'),
    ],
    match                                   : [
      /^(?=.{1,50}$)[a-zåäö]+(?:['_.\s][a-z]+)*$/i,
      t('ForenameInvalid'),
    ],
  },
  surname                                   : {
    type                                    : String,
    trim                                    : true,
    minlength                               : 2,
    required                                : [
      true,
      t('SurnameRequired'),
    ],
    match                                   : [
      /^(?=.{1,50}$)[a-zåäö]+(?:['_.\s][a-z]+)*$/i,
      t('SurnameInvalid'),
    ],
  },
  password                                  : {
    type                                    : String,
    maxlength                               : 128,
    required                                : [
      true,
      t('PasswordRequired'),
    ],
    select                                  : false,
  },
  role                                      : {
    type                                    : String,
    required                                : true,
    enum                                    : [ 'admin', 'moderator', 'user' ],
    default                                 : 'user',
  },
  isActive                                  : {
    type                                    : Boolean,
    required                                : true,
    default                                 : true,
  }
}, {
  timestamps                                : true,
})

UserSchema.pre('save', async function(next) {
  if(this.isNew || this.isModified('email'))
    this.email                              = this.email.toLowerCase()

  if(this.isNew || this.isModified('forename'))
    this.forename                           = StringHelper.Capitalize(this.forename)

  if(this.isNew || this.isModified('surname'))
    this.surname                            = StringHelper.Capitalize(this.surname)

  if(this.isNew || this.isModified('password'))
    this.password                           = await PasswordHelper.Hash(this.password)

  next()
})

UserSchema.statics.SerializeUser            = (user) => {
  return {
    _id                                     : user._id,
    email                                   : user.email,
    username                                : user.username,
    forename                                : user.forename,
    surname                                 : user.surname,
    role                                    : user.role,
    createdAt                               : user.createdAt,
    updatedAt                               : user.updatedAt,
  }
}

const UserModel                             = mongoose.model('User', UserSchema)

export {
  UserModel as default
}
