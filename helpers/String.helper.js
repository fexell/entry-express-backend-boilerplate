import { Types, ObjectId } from 'mongoose'

const StringHelper                          = {}

StringHelper.Capitalize                     = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
StringHelper.ConvertToObjectId              = (id) => Types.ObjectId.createFromHexString(id)
StringHelper.ConvertObjectIdToString        = (id) => {
  if(Types.ObjectId.isValid(id)) return id.toString()
  else return Types.ObjectId.createFromHexString(id).toString()
    || Types.ObjectId.createFromBase64(id).toString()
    || Types.ObjectId.createFromTime(id).toString()
}

export {
  StringHelper as default
}
