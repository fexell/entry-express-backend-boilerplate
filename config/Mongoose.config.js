import mongoose from 'mongoose'

import { getDbString } from './Environment.config.js'

const ConnectDatabase                = async () => {
  try {
    await mongoose.connect(getDbString())

    console.log('Mongoose connected successfully...')
  } catch (error) {
    console.error(`Mongoose Error: ${ error }`)
  }
}

mongoose.connection.on('error', (error) => console.error(`Mongoose Error: ${ error }`))

export {
  ConnectDatabase as default,
}
