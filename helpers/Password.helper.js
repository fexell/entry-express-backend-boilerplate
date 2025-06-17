import argon2 from 'argon2'

const PasswordHelper                        = {}

PasswordHelper.Hash                         = async (password) => {
  return await argon2.hash(password)
}

PasswordHelper.Verify                       = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password)
}

export {
  PasswordHelper as default
}
