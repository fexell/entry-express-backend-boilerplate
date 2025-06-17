import cors from 'cors'

export const corsOptions                    = {}

const CorsMiddleware                 = cors(corsOptions)

export {
  CorsMiddleware as default
}
