import UserAgent from 'user-agents'
import { getUserAgent } from 'universal-user-agent'

const HeadersHelper                         = {}

HeadersHelper.GetUserAgent                  = (req) => req.headers['user-agent'] || getUserAgent()

export {
  HeadersHelper as default
}
