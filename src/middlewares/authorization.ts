import jwt from "express-jwt";
import JwksRsa from "jwks-rsa";

import ENV from "../config/env";

const authorizeAccessToken = jwt({
  secret: JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${ENV.AUTH0.DOMAIN}/.well-known/jwks.json`,
  }),
  audience: ENV.AUTH0.AUDIENCE,
  issuer: `https://${ENV.AUTH0.DOMAIN}/`,
  algorithms: ["RS256"],
});

export default authorizeAccessToken;
