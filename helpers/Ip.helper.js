import requestIp from 'request-ip'

const IpHelper                              = {}

IpHelper.GetIp                              = (req) => {
  return req.headers[ 'x-forwarded-for' ] || req.socket.remoteAddress || requestIp.getClientIp(req)
}

export {
  IpHelper as default
}
